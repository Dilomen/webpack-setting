#!/usr/bin/env node
if (process.env.NODE_ENV === "development") {
    require('../lib/server')()
} else {
    require('../lib/build')()
}