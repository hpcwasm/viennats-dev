#!/usr/bin/python3

import http.server
import socketserver
import time


def main():
    PORT = 8000
    global httpd
    Handler = http.server.SimpleHTTPRequestHandler

    Handler.extensions_map['.shtml'] = 'text/html'
    # allows for streaming compile
    Handler.extensions_map['.wasm'] = 'application/wasm'

    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("0.0.0.0", PORT), Handler)
    # with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at http://localhost:{}/viennats.html".format(PORT))
    print("serving at http://localhost:{}/vtswasm.html".format(PORT))
    print("serving at http://localhost:{}/vtswasm_worker.html".format(PORT))
    print("serving at http://localhost:{}/vtswasm_worker_ddown.html".format(PORT))
    # print('<a href="http://localhost:{}">http://localhost:{}</a>'.format(PORT,PORT))
    # httpd.allow_reuse_address = True
    print('ctrl-c to quit server.')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.shutdown()
        httpd.socket.close()
        httpd.server_close()
        time.sleep(1)
        print(time.asctime(),"Server Stopped")
    except:
        httpd.shutdown()
        httpd.socket.close()
        httpd.server_close()
        time.sleep(1)
        print(time.asctime(),"Server Stopped")        

if __name__== "__main__":
    main()