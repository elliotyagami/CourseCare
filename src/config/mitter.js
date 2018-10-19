import Mitter from '@mitter-io/node'

import dotenv from 'dotenv'
dotenv.config()

export const mitter = Mitter.Mitter.forNode(
    process.env.MITTER_APPLICATION_ID,
    {
        "accessKey": process.env.MITTER_ACCESS_KEY,
        "accessSecret": process.env.MITTER_ACCESS_SECRET
    }
)

export const userAuthClient = mitter.clients().userAuth()
export const userClient = mitter.clients().users()
export const channelClient = mitter.clients().channels()
