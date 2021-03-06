const convertToPsqlTimeStamp = data => {
  return data.reduce((newData, datum) => {
    const { created_at, ...restOfData } = datum;
    restOfData.created_at = new Date(datum.created_at);
    newData.push(restOfData);
    return newData;
  }, []);
};

const titleIdKeyPair = data => {
  const pairs = data.reduce((newData, datum) => {
    newData[datum.title] = datum.article_id;
    return newData;
  }, {});
  return pairs;
};

const replaceArticleId = (data, pairs) => {
  return data.reduce((newData, datum) => {
    const { belongs_to, ...restOfData } = datum;
    restOfData.article_id = pairs[belongs_to];
    newData.push(restOfData);
    return newData;
  }, []);
};

const changeKeyToAuthor = data => {
  return data.reduce((newData, datum) => {
    const { created_by, ...restOfData } = datum;
    restOfData.author = created_by;
    newData.push(restOfData);
    return newData;
  }, []);
};

// create a title / article_if reference pair

module.exports = {
  convertToPsqlTimeStamp,
  titleIdKeyPair,
  replaceArticleId,
  changeKeyToAuthor
};
