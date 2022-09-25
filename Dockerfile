FROM python:3.9-alpine
COPY ./requirements.txt /app/requirements.txt
COPY . /app/
WORKDIR /app
RUN apk add git
RUN pip install -r requirements.txt
EXPOSE 8080
CMD ["gunicorn","--bind",":8080","--workers","2","app.app:app"]
