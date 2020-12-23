import React from 'react';
import './Table.css';

function Table({ countries, title }) {
    return (
        <div>
            <h3 className='table__title'>{title}</h3>
            <table className='table'>
                {countries.map(({ country, cases }) => {
                    return (
                        <tr key={country}>
                            <td>{country}</td>
                            <td><strong>{cases}</strong></td>
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}

export default Table
