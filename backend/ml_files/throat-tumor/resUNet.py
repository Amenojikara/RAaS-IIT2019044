import os
import sys
import random
import numpy as np
import cv2
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from keras.layers import Conv2D, MaxPooling2D, UpSampling2D, Concatenate
from keras.layers import Input, BatchNormalization, Activation, Add, Layer, Flatten
from keras.models import Model
from tensorflow.python.ops.math_ops import reduce_sum_v1 as reduce_sum

seed = 2020
random.seed = seed
np.random.seed = seed
tf.seed = seed


class DataGen(keras.utils.Sequence):
    def __init__(self, ids, path, batch_size=8, image_size=128):
        self.ids = ids
        self.path = path
        self.batch_size = batch_size
        self.image_size = image_size
        self.on_epoch_end()
        
    def __load__(self, id_name):
        image_path = os.path.join(self.path, id_name, "images", id_name) + ".png"
        mask_path = os.path.join(self.path, id_name, "masks/")
        all_masks = os.listdir(mask_path)
        
        image = cv2.imread(image_path, 1)
        image = cv2.resize(image, (self.image_size, self.image_size))
        
        mask = np.zeros((self.image_size, self.image_size, 1))
        
        for name in all_masks:
            name_path = mask_path +  name
            name_image = cv2.imread(name_path, -1)
            name_image = cv2.resize(name_image, (self.image_size, self.image_size))
            
            name_image = np.expand_dims(name_image, axis=-1)
            mask = np.maximum(mask, name_image)
    
        image = image/255.0
        mask = mask/255.0
        
        return image, mask
    
    def __getitem__(self, index):
        if (index+1)*self.batch_size > len(self.ids):
            self.batch_size = len(self.ids) - index*self.batch_size
            
        file_batch = self.ids[index*self.batch_size : (index+1)*self.batch_size]
        
        image = []
        mask = []

        for id_name in file_batch:
            _img, _mask = self.__load__(id_name)
            image.append(_img)
            mask.append(_mask)
            
        image = np.array(image)
        mask = np.array(mask)
        
        return image, mask
    def on_epoch_end(self):
        pass
    
    def __len__(self):
        return int(np.ceil(len(self.ids)/float(self.batch_size)))
    
### HYPERPARAMETERS ###
IMAGE_SIZE = 128
TRAIN_PATH = "dataset/train/"
EPOCHS = 10
BATCH_SIZE = 8

train_ids = next(os.walk(TRAIN_PATH))[1]

val_data_size = 10

valid_ids = train_ids[:val_data_size]
train_ids = train_ids[val_data_size:]

gen = DataGen(train_ids, TRAIN_PATH, batch_size=BATCH_SIZE, image_size=IMAGE_SIZE)
x, y = gen.__getitem__(0)


### DIFFERENT BLOCKS ###
def bn_act(x, act=True):
    x = BatchNormalization()(x)
    if act == True:
        x = Activation("relu")(x)
    return x

def conv_block(x, filters, kernel_size=(3,3), padding="same", strides=1):
    conv = bn_act(x)
    conv = Conv2D(filters, kernel_size, padding=padding, strides=strides)(conv)
    return conv

def stem(x, filters, kernel_size=(3,3), padding="same", strides=1):
    conv = Conv2D(filters, kernel_size, padding=padding, strides=strides)(x)
    conv = conv_block(conv, filters, kernel_size=kernel_size, padding=padding, strides=strides)
    
    shortcut = Conv2D(filters, kernel_size=(1,1), padding=padding, strides=strides)(x)
    shortcut = bn_act(shortcut, act=False)
    
    output = Add()([conv, shortcut])
    return output

def residual_block(x, filters, kernel_size=(3,3), padding="same", strides=1):
    res = conv_block(x, filters, kernel_size=kernel_size, padding=padding, strides=strides)
    res = conv_block(res, filters, kernel_size=kernel_size, padding=padding, strides=1)    
    
    shortcut = Conv2D(filters, kernel_size=(1,1), padding=padding, strides=strides)(x)
    shortcut = bn_act(shortcut, act=False)
    
    output = Add()([res, shortcut])
    return output

def upsample_concat_block(x, xskip):
    u = UpSampling2D((2, 2))(x)
    concat = Concatenate()([u ,xskip])
    return concat

#### ResUnet ###
def ResUNet():
    f = [16, 32, 64, 128, 256]
    inputs = Input((IMAGE_SIZE, IMAGE_SIZE, 3))
    
    # ENCODER
    e0 = inputs
    e1 = stem(e0, f[0])
    e2 = residual_block(e1, f[1], strides=2)
    e3 = residual_block(e2, f[2], strides=2)
    e4 = residual_block(e3, f[3], strides=2)
    e5 = residual_block(e4, f[4], strides=2)
    
    # BRIDGE
    b0 = conv_block(e5, f[4], strides=1)
    b1 = conv_block(b0, f[4], strides=1)
    
    # DECODER
    u1 = upsample_concat_block(b1, e4)
    d1 = residual_block(u1, f[4])    
 
    u2 = upsample_concat_block(d1, e3)
    d2 = residual_block(u2, f[3])
    
    u3 = upsample_concat_block(d2, e2)
    d3 = residual_block(u3, f[2])
    
    u4 = upsample_concat_block(d3, e1)
    d4 = residual_block(u4, f[1])
    
    outputs = Conv2D(1, (1,1), padding="same", activation="sigmoid")(d4)
    model = Model(inputs, outputs)
    return model
 
    
smooth = 1.
def dice_coef(y_true, y_pred):
    # y_true_f = tf.layers.flatten(y_true)
    y_true_f = Flatten()(y_true)
    # y_pred_f = tf.layers.flatten(y_pred)
    y_pred_f = Flatten()(y_pred)
    intersection = reduce_sum(y_true_f * y_pred_f)
    return (2. * intersection + smooth) / (reduce_sum(y_true_f) + reduce_sum(y_pred_f) + smooth)


def dice_coef_loss(y_true, y_pred):
    return 1.0 - dice_coef(y_true, y_pred)
 
    
model = ResUNet()
adam = keras.optimizers.Adam()
model.compile(optimizer=adam, loss=dice_coef_loss, metrics=[dice_coef])
model.summary()

     
### TRAINING ###
train_gen = DataGen(train_ids, TRAIN_PATH, image_size=IMAGE_SIZE, batch_size=BATCH_SIZE)
valid_gen = DataGen(valid_ids, TRAIN_PATH, image_size=IMAGE_SIZE, batch_size=BATCH_SIZE)
 
train_steps = len(train_ids) // BATCH_SIZE
valid_steps = len(valid_ids) // BATCH_SIZE

model.fit_generator(train_gen, validation_data=valid_gen,
          steps_per_epoch=train_steps, validation_steps=valid_steps,
          epochs=EPOCHS)

model.save("ResUNet.h5")
    
x, y = valid_gen.__getitem__(1)
result = model.predict(x)

result = result > 0.5

fig = plt.figure()
fig.subplots_adjust(hspace=0.4, wspace=0.4)
ax = fig.add_subplot(1,2,1)
ax.imshow(np.reshape(y[0]*255, (IMAGE_SIZE, IMAGE_SIZE)), cmap="gray")
ax = fig.add_subplot(1,2,2)
ax.imshow(np.reshape(result[0]*255, (IMAGE_SIZE, IMAGE_SIZE)), cmap="gray")
plt.show()

fig = plt.figure()
fig.subplots_adjust(hspace=0.4, wspace=0.4)
ax = fig.add_subplot(1, 2, 1)
ax.imshow(np.reshape(y[1]*255, (IMAGE_SIZE, IMAGE_SIZE)), cmap="gray")
ax = fig.add_subplot(1, 2, 2)
ax.imshow(np.reshape(result[1]*255, (IMAGE_SIZE, IMAGE_SIZE)), cmap="gray")
plt.show()            
            
    