FROM golang:1.15 AS build
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build .

########################################

FROM alpine:latest as support
RUN apk --no-cache add tzdata zip ca-certificates
WORKDIR /usr/share/zoneinfo
RUN zip -q -r -0 /zoneinfo.zip .

########################################

FROM scratch AS prod
WORKDIR /app

ENV ZONEINFO /zoneinfo.zip
COPY --from=support /zoneinfo.zip /
COPY --from=support /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=build /app/aegiseek /app/aegiseek
CMD [ "/app/aegiseek" ]
