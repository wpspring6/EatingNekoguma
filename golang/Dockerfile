FROM golang:1.14.12

RUN go get github.com/labstack/echo/...
RUN go get github.com/labstack/echo/middleware
RUN go get github.com/jinzhu/gorm
RUN go get github.com/go-sql-driver/mysql
RUN go get github.com/ipfans/echo-session

WORKDIR /app
ADD . /app

CMD ["go", "run", "main.go"]