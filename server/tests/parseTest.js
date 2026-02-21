const { parseCSV, detectCategory } = require('../utils/parsingService');

const testCSV = Buffer.from(
    `Date,Amount,Description,Type
2026-02-15,-500.0,Swiggy Order,expense
2026-02-16,-2000.0,Uber Ride,expense
2026-02-17,50000.0,Salary,income
2026-02-18,-1500.0,Amazon Shopping,expense`
);

const runTest = async () => {
    console.log('Testing Category Detection:');
    console.log('Swiggy ->', detectCategory('Swiggy Order'));
    console.log('Uber ->', detectCategory('Uber Ride'));
    console.log('Amazon ->', detectCategory('Amazon Shopping'));
    console.log('Netflix ->', detectCategory('Netflix Subscription'));

    console.log('\nTesting CSV Parsing:');
    try {
        const results = await parseCSV(testCSV);
        console.log(JSON.stringify(results, null, 2));
    } catch (err) {
        console.error('CSV Parsing Error:', err);
    }
};

runTest();
