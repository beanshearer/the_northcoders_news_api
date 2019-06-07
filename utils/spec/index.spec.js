const { expect } = require("chai");
const { convertingToPsqlTimeStamp, keyPair, replacingKeys, changeKeyName } = require("../index")
const { articlesData } = require('../../db/data/');

(articlesData)

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
    it('coverts into the psql format', () => {
      const output = [{
          title: 'Running a Node App',
          topic: 'coding',
          author: 'jessjelly',
          body:
            'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
          created_at: new Date(1471522072389),
        }];
      expect(convertingToPsqlTimeStamp(articlesData)).to.equal(output)
  })
})

describe('keyPair()', () => {
    it('key pair of one objects title_id and title', () => {
        const input = [
          { 
            article_id: 1,
            title: 'Running a Node App',
            topic: 'coding',
            author: 'jessjelly',
            body:
              'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
            created_at: 1471522072389,
          }];
        const output = {
          'Running a Node App': 1,
        };
        expect(keyPair(input)).to.eql(output)
    })
    it('key pair of two objects title_id and title', () => {
      const input = [ { 
        article_id: 1,
        title: 'Running a Node App',
        topic: 'coding',
        author: 'jessjelly',
        body:
          'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      },
        { 
          article_id: 2,
          title: 'Running a Node App',
          topic: 'redness',
          author: 'jessjelly',
          body:
            'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
          created_at: 1471522072389,
        } ];
      const output = {
        'Running a Node App': 1,
        'Running a Node App': 2,
      };
      expect(keyPair(input)).to.eql(output)
  })
})

describe.only('replacingKeys()', () => {
  it('replaces one key and value using the key value pair', () => {
      const pairs = {
        'Running a Node App':1,
      };
      const input = [
        {
          body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
          belongs_to: 'Running a Node App',
          created_by: 'tickle122',
          votes: -1,
          created_at: 1468087638932,
        } ]
      const output = [{
          body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
          article_id: 1,
          created_by: 'tickle122',
          votes: -1,
          created_at: 1468087638932,
      }];
      expect(replacingKeys(input, pairs)).to.eql(output)
  })
})

describe.only('changeKeyName()', () => {
  it('replaces one key name', () => {
      const input = [
        {
          body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
          article_id: 1,
          created_by: 'tickle122',
          votes: -1,
          created_at: 1468087638932,
        } ]
      const output = [{
          body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
          article_id: 1,
          author: 'tickle122',
          votes: -1,
          created_at: 1468087638932,
      }];
      expect(changeKeyName(input)).to.eql(output)
  })
})
