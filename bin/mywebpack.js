#!/usr/bin/env node
if (process.env.NODE_ENV === "development") {
    require('../lib/server')()
} else if (process.env.NODE_ENV === "production") {
    require('../lib/build')()
} else {
    throw new Error("NODE_ENV 必须设置为 development | production")
}