import { Kafka } from 'kafkajs';

const BROKER = process.env.KAFKA_BROKERS || 'localhost:19092';

const kafka = new Kafka({
  clientId: 'basket',
  brokers: [BROKER],
});

const producer = kafka.producer();

let connected = false;

export const sendMessageSync = async (topic: string, message: string) => {
  try {
    if (!connected) {
      await producer.connect();
      connected = true;
    }
    await producer.send({
      topic,
      messages: [{ value: message }],
    });
  } catch (err) {
    console.error('Failed to send message', err);
    throw err;
  }
};

export const sendEvent = async (topic: string, event: any, key?: string) => {
  try {
    if (!connected) {
      await producer.connect();
      connected = true;
    }
    
    producer.send({
      topic,
      messages: [{ 
        value: JSON.stringify(event),
        key: key || event.client_id
      }],
    });
  } catch (err) {
    console.error('Failed to send event', err);
    throw err;
  }
};

export const disconnectProducer = async () => {
  if (connected) {
    await producer.disconnect();
    connected = false;
  }
};
