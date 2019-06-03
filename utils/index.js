

const convertingToPsqlTimeStamp = (data) => {
    return data.reduce((newData, datum) => {
        const { created_at, ...restOfData } = datum;
        restOfData.created_at = new Date(datum.created_at);
        newData.push(restOfData);
        return newData;
    }, []); 
}; 

module.exports = { convertingToPsqlTimeStamp }

