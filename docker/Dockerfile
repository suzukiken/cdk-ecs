FROM debian:10-slim

RUN apt update
RUN apt install python3 -y --no-install-recommends
RUN apt install python3-pip -y --no-install-recommends

RUN pip3 install tornado

RUN mkdir /opt/function
WORKDIR /opt/function

ADD tornado_server.py /opt/function/tornado_server.py

CMD [ "python3", "/opt/function/tornado_server.py" ]
