import React, { useState } from 'react'
import {Modal, Button, Form, Col} from 'react-bootstrap'



const Search = () => {

    const [smShow, setSmShow] = useState(false);
    const [surah, setSurah] = useState('')
    const [aayah, setAayah] = useState('')

    const print = () => {
 
        console.log(`Surah number is: ${surah}`)
        console.log(`Aayah number is: ${aayah}`)
    }

    return (
        <>
          <button onClick={() => setSmShow(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
              </button>{' '}
          <Modal

            size="sm"
            show={smShow}
            onHide={() => setSmShow(false)}
            aria-labelledby="Search for an Ayah"
          >
            <Modal.Header closeButton>
              <Modal.Title         id="example-modal-sizes-title-sm">
                Search for an Ayah
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <lable> Surah </lable>

                <input 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"

                type="text"
                value={surah}
                onChange={(e) => {setSurah(e.target.value)}}
              

                />

              
                <input type="text"
                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter Aayah Number"
                value={aayah}
                onChange={(e) => {setAayah(e.target.value)}}
                
                />
                <button onClick={print}
                              type="submit"

                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                > <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg> </button>
            

            

            </Modal.Body>
          </Modal>
        
        </>
      );
    }

export default Search
