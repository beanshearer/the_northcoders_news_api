const { expect } = require("chai");
const { convertingToPsqlTimeStamp } = require("../index")
const { articlesData } = require('../../db/data/');

console.log(articlesData)

describe('convertingToPsqlTimeStamp()', () => {
    it('coverts into the psql format', () => {
        const input =  [{
            title: 'Running a Node App',
            topic: 'coding',
            author: 'jessjelly',
            body:
              'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
            created_at: 1471522072389,
          }]; 
        const output = [{
            title: 'Running a Node App',
            topic: 'coding',
            author: 'jessjelly',
            body:
              'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
            created_at: new Date(1471522072389),
          }];
        expect(convertingToPsqlTimeStamp(input)).to.equal(output)
    })
})

describe('convertingToPsqlTimeStamp()', () => {
    it('coverts into the psql format', () => {
        const output = [{
            title: 'Running a Node App',
            topic: 'coding',
            author: 'jessjelly',
            body:
              'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
            created_at: new Date(1471522072389),
          }];
        expect(convertingToPsqlTimeStamp({articleData})).to.equal(output)
    })
})