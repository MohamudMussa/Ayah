import React, { useState } from 'react'
import {Modal, Button, Form, Col} from 'react-bootstrap'



const Search = () => {

    const [smShow, setSmShow] = useState(false);

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

            <Form class="text-black text-opacity-25 ... font-mono text-sm text-centre" >
  <Form.Row>
    <Col>
      <Form.Control placeholder="Suran Numb" />
    </Col>
    <Col>
      <Form.Control placeholder="Ayah Numb" />
    </Col>
  </Form.Row>
</Form>

<Button >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
              </Button>


            </Modal.Body>
          </Modal>
        
        </>
      );
    }

export default Search
