


const totalRanks = 5 ;

function main(Records) {

    try {

        const totalAmountInvested = new Map() // Map  to store inverstor_id as key an total amount as value

        const investorsSyndicates = new Map() // Map to store investor_id as key and set of syndicate ids as value

        // aggegating the records 
        Records.map(function (record) {

            const {
                inverstor_id,
                syndicate_id,
                transaction_amount
            } = record

            const totalAmount = totalAmountInvested.get(inverstor_id)

            if (totalAmount) { 
                totalAmountInvested.set(inverstor_id, totalAmount + transaction_amount)
            } else { // if totalAmount is undefined set current transaction amount  
                totalAmountInvested.set(inverstor_id, transaction_amount)
            }


            const syndicates = investorsSyndicates.get(inverstor_id)

            if (syndicates) {
                syndicates.add(syndicate_id)
                investorsSyndicates.set(inverstor_id, syndicates)
            } else { // if no syndicates is undefined create a new set with current syndicate_id 
                investorsSyndicates.set(inverstor_id, new Set([syndicate_id]))
            }

        })

        const syndicateCountOfInvestor = new Map() // Map to store syndicate count as key and investor id as value 

        const syndicateCounts = [] // to store the syndicate counts of the investors 

        const investorIds = [...investorsSyndicates.keys()] // ids of all the investors 

        //  iterate over the investor ids and store  (syndicate_count => inverstor_id) as (key => value) in syndicateCountOfInvestor
        investorIds.map(function (investorId) {
            const inverstorTotalSyndicate = investorsSyndicates.get(investorId).size // count of syndicates for investorId
            syndicateCounts.push(inverstorTotalSyndicate) // storing the counts to sort later for ranking 
            syndicateCountOfInvestor.set(inverstorTotalSyndicate, investorId);
        })

        syndicateCounts.sort() // sorting the counts to get the top N ( 2,3,5 etc) number of investors 

        // in case the , total number of investors is less than totalRanks 
        const numberOfTopInvestorsToShow = syndicateCounts.length > totalRanks ? totalRanks : syndicateCounts.length;

        // show the top N investors 
        for (let i = 0; i < numberOfTopInvestorsToShow; i += 1) {
            // show all     
            const investorId = syndicateCountOfInvestor.get(syndicateCounts[i])
            console.log(`investor id = ${investorId} , number of syndicates = ${syndicateCounts[i]} , total invested = ${totalAmountInvested.get(investorId)} \n`)
        }

    } catch (e) {
        console.log(e)
        console.log(` --- an exception occurred ---`)

    }


}
const ExampleRecords = [

    {
        inverstor_id: 1,
        syndicate_id: 1,
        transaction_amount: 1000,
        transaction_date: '02-03-2020'
    }
]

main(ExampleRecords)