import os
import random
import numpy as np
import cv2
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from keras.layers import Conv2D, MaxPooling2D, UpSampling2D, Concatenate
from keras.layers import Input, BatchNormalization, Activation, Add, Layer, Flatten
from keras.models import Model

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
        image = cv2.imread(image_path, 1)
        image = cv2.resize(image, (self.image_size, self.image_size))
        
        image = image/255.0
        return image
    
    def __getitem__(self, index):
        if (index+1)*self.batch_size > len(self.ids):
            self.batch_size = len(self.ids) - index*self.batch_size
            
        file_batch = self.ids[index*self.batch_size : (index+1)*self.batch_size]
        
        image = []
        for id_name in file_batch:
            _img = self.__load__(id_name)
            image.append(_img)    
        image = np.array(image)
        
        return image
    def on_epoch_end(self):
        pass
    
    def __len__(self):
        return int(np.ceil(len(self.ids)/float(self.batch_size)))
    

def down_block(x, filters, kernel_size=(3,3), padding="same", strides=1):
    c = Conv2D(filters, kernel_size, padding=padding, strides=strides, activation="relu")(x)
    c = Conv2D(filters, kernel_size, padding=padding, strides=strides, activation="relu")(c)
    p = MaxPooling2D((2,2), (2,2))(c)
    return c, p

def up_block(x, skip, filters, kernel_size=(3,3), padding="same", strides=1):
    us = UpSampling2D((2, 2))(x)
    concat = Concatenate()([us, skip])
    c = Conv2D(filters, kernel_size, padding=padding, strides=strides, activation="relu")(concat)
    c = Conv2D(filters, kernel_size, padding=padding, strides=strides, activation="relu")(c)    
    return c

def bottleneck(x, filters, kernel_size=(3,3), padding="same", strides=1):
    c = Conv2D(filters, kernel_size, padding=padding, strides=strides)(x)
    c = Conv2D(filters, kernel_size, padding=padding, strides=strides)(c)
    return c

def UNet():
    f = [16, 32, 64, 128, 256]
    inputs = Input((IMAGE_SIZE, IMAGE_SIZE, 3))
    
    p0 = inputs
    c1, p1 = down_block(p0, f[0]) # 128->64
    c2, p2 = down_block(p1, f[1]) # 64->32
    c3, p3 = down_block(p2, f[2]) # 32->16
    c4, p4 = down_block(p3, f[3]) # 16->8
    
    bn = bottleneck(p4, f[4])
    
    u1 = up_block(bn, c4, f[3]) # 8->16
    u2 = up_block(u1, c3, f[2]) # 16->32
    u3 = up_block(u2, c2, f[1]) # 32->64
    u4 = up_block(u3, c1, f[0]) # 64->128
    
    outputs = Conv2D(1, (1,1), padding="same", activation="sigmoid")(u4)
    model = Model(inputs, outputs)
    return model

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


IMAGE_SIZE = 128
TEST_PATH = "dataset/test/"
BATCH_SIZE = 65

test_ids = next(os.walk(TEST_PATH))[1]

gen = DataGen(test_ids, TEST_PATH, batch_size=BATCH_SIZE, image_size=IMAGE_SIZE)
x= gen.__getitem__(0)
print(x.shape)

model1 = UNet()
model2 = ResUNet()

model2.load_weights('ResUNet.h5')
model1.load_weights('UNetW.h5')

result1 = model1.predict(x)
result1 = result1 > 0.5

result2 = model2.predict(x)
result2 = result2 > 0.5


fig = plt.figure()
fig.subplots_adjust(hspace=0.4, wspace=0.4)
ax = fig.add_subplot(1,2,1)
ax.imshow(x[17])
plt.title("Original Image")
# ax = fig.add_subplot(1,3,2)
# ax.imshow(np.reshape(result1[17]*255, (IMAGE_SIZE, IMAGE_SIZE)), cmap="gray")
# plt.title("UNet Mask")
ax = fig.add_subplot(1,2,2)
ax.imshow(np.reshape(result2[17]*255, (IMAGE_SIZE, IMAGE_SIZE)), cmap="gray")
plt.title("ResUNet Mask")
plt.show()








