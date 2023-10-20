const Redis = require("ioredis");

// initialize a Redis client
const redis = new Redis();

// define sliding window parameters
const slidingWindowKey = "syndicate_transactions"
const slidingWindowDuration = 3600 // 1hr = 3600s
const amountThreshold = 3000


async function main(transaction) {

    const { syndicate, amount, timestamp } = transaction

    // AMOUNT THRESHOLD  ALERT
    if (amount > amountThreshold) {
        trigger.Alert(`Amount threshold exceeded for syndicate:  ${syndicate} , amount = ${amount}`)
    }
    // UNUSUAL TRANSACTIONS  ALERT
    const currentTime = Math.floor(Date.now() / 1000)
    // add the transaction to the Sorted Set with the timestamp as the score
    await redis.zadd(slidingWindowKey, timestamp, syndicate);
    // remove outdated data points
    const minTimestamp = currentTime - slidingWindowDuration;
    await redis.zremrangebyscore(slidingWindowKey, "-inf", minTimestamp);
    // retrieve data points within the sliding window
    const dataWithinWindow = await redis.zrangebyscore(slidingWindowKey, minTimestamp, "+inf");
    // calculate the rate within the sliding window
    const transactionCount = dataWithinWindow.length;
    // set threshold rate 
    const rateThreshold = 10 * (transactionCount / slidingWindowDuration);
    if (transactionCount > rateThreshold) {
        trigger.Alert('unsual transaction rate spike ');
    }
}

const trigger = {
    Alert(message) {
        // code for trigger 
        console.log(`ALERT:  ${message}}`)
    },
    Warning(message) {
        console.log(`WARNING:  ${message}}`)
    }
}


const exampleTransaction = {
    syndicate: "Test-1",
    amount: 1200,
    timestamp: Math.floor(Date.now() / 1000)
};

main(exampleTransaction)
    .then(() => {
        redis.quit();
    })
    .catch((error) => {
        console.error("Error:", error);
    });
