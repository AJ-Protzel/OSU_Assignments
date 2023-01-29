// node producer.js // update amqp server

const amqp = require('amqplib')

const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost'
const rabbitmqUrl = `amqp://${rabbitmqHost}`

async function main() {
    const connection = await amqp.connect(rabbitmqUrl)
    const channel = await connection.createChannel()
    await channel.assertQueue('echo')

    setTimeout(function () {
        connection.close()
    }, 500)
}

main()
