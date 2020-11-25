#!/usr/bin/env node
if (process.env.NODE_ENV === "development") {
    require('../lib/server')(process.argv[2])
} else if (process.env.NODE_ENV === "production") {
    require('../lib/build')(process.argv[2])
} else {
    throw new Error("NODE_ENV 必须设置为 development | production")
}