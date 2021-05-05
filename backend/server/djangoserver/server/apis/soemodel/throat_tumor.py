import os
import random
import numpy as np
import cv2
import codecs, json
import tensorflow as tf
from tensorflow import keras
from keras.layers import Conv2D, MaxPooling2D, UpSampling2D, Concatenate
from keras.layers import Input, BatchNormalization, Activation, Add, Layer, Flatten
from keras.models import Model
from apis.models import ThroatTumorDisease, Files
from decouple import config
from server.settings import BASE_DIR
import pyrebase
firebaseConfig = {
    "apiKey": config('API_KEY'),
    "databaseURL": config('DATABASE_URL'),
    "authDomain": config('AUTH_DOMAIN'),
    "projectId": config('PROJECT_ID'),
    "storageBucket": config('STORAGE_BUCKET'),
    "messagingSenderId": config('MESSAGING_SENDER_ID'),
    "appId": config('APP_ID'),
    "measurementId": config('MEASUREMENT_ID')
}

firebase = pyrebase.initialize_app(firebaseConfig)
storage = firebase.storage()

seed = 2020
random.seed = seed
np.random.seed = seed
tf.seed = seed
IMAGE_SIZE = 128
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Incoming JSON request Body
# {
#     "title": "image_name",
# }


# ResUNet MIDDLE LAYERS
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

# ResUNet 

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


def throat_tumor_predictor(id):
    print(id)
    class NumpyEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return json.JSONEncoder.default(self, obj)

    downloadLink = f"mri_images/{id}.png"
    TEST_PATH = BASE_DIR + f"\mri_images\{id}.png"
    storage.child(downloadLink).download(TEST_PATH)

    IMAGE_SIZE = 128
    image = cv2.imread(str(TEST_PATH), 1)
    image = cv2.resize(image, (IMAGE_SIZE, IMAGE_SIZE))
    x = image/255.0
    x = np.expand_dims(x, axis=0)

    model = ResUNet()
    model.load_weights(f"{Files.objects.get(name='throat_ResUNetW').file}")

    result = model.predict(x)
    result = result > 0.5
    result = result[0] * 255
    
    path = BASE_DIR + f"\\throat_prediction\{id}_mask.png"
    cv2.imwrite(path, result)

    storage.child(f'mri_prediction/{id}_mask.png').put(path)

    ret = {
        "status": "success",
        "prediction": {
            "mri_image": storage.child(f'mri_images/{id}.png').get_url(None),
            "mask_image": storage.child(f'mri_prediction/{id}_mask.png').get_url(None)
        }   
    }

    # print(ret)

    js = json.dumps(ret, cls=NumpyEncoder)
    
    return ret