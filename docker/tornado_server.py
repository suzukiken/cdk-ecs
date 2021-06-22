import tornado.ioloop
import tornado.web
import os
import json

port = 80

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, I am Tornado.")
        
def make_app():
    return tornado.web.Application([
        (r"/", IndexHandler)
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(port)
    tornado.ioloop.IOLoop.current().start()