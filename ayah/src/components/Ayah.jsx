import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Ayah = () => {

    const [ayah, setAyah] = useState(['hello'])

    const apiURL = 'https://api.quran.com/api/v4/verses/random?language=en&words=true';
    
    useEffect(() => {
       axios.get('https://api.quran.com/api/v4/verses/random?language=en&words=true')
       .then(response => {
        setAyah(response.data.verse);
        console.log(response.data.verse);
       })
      }, []);

  

    return (    
        <table>
        <tbody>
            <tr>
                <th>Name:</th>
                <th>Age:</th>
                <th>Salary:</th>
            </tr>
           
        </tbody>
    </table>
    )
}

export default Ayah
