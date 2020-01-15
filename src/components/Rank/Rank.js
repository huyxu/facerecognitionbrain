import React from 'react';

const Rank = ({ name, entries }) => {
    console.log(name);
    return (
        <div>
            <div className='white f4'>
                {`${name}, your current rank is...`}
            </div>
            <div className='white f1'>
                #{entries}
            </div>
        </div>
    );
}

export default Rank;