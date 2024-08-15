import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card , Modal, Form} from 'react-bootstrap'
import { Link ,useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PayPalButton } from 'react-paypal-button-v2'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

function OrderScreen({ history }) {
    const { id } = useParams()
    const orderId = id
    const dispatch = useDispatch()


    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
// debut
    const [show, setShow] = useState(false)
    const [numTel, setNumTel] = useState('')
    const [motDePasse, setMotDePasse] = useState('')

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleConfirm = () => {
        // Handle confirmation logic here
        console.log('Numéro de téléphone:', numTel)
        console.log('Mot de passe:', motDePasse)
        handleClose()
    }
// fin

    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }


    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AeDXja18CkwFUkL-HQPySbzZsiTrN52cG13mf9Yz7KiV2vNnGfTDP0wDEN9sGlhZHrbb_USawcJzVDgn'
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(() => {

        if (!userInfo) {
            history.push('/login')
        }

        if (!order || successPay || order._id !== Number(orderId) || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })

            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, order, orderId, successPay, successDeliver])


    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
                <div>
                    <h1>Order: {order.Id}</h1>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p><strong>Name: </strong> {order.user.name}</p>
                                    <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                                    <p>
                                        <strong>Shipping: </strong>
                                        {order.shippingAddress.address},  {order.shippingAddress.city}
                                        {'  '}
                                        {order.shippingAddress.postalCode},
                                {'  '}
                                        {order.shippingAddress.country}
                                    </p>

                                    {order.isDelivered ? (
                                        <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                    ) : (
                                            <Message variant='warning'>Not Delivered</Message>
                                        )}
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                        <Message variant='success'>Paid on {order.paidAt}</Message>
                                    ) : (
                                            <Message variant='warning'>Not Paid</Message>
                                        )}

                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <h2>Order Items</h2>
                                    {order.orderItems.length === 0 ? <Message variant='info'>
                                        Order is empty
                             </Message> : (
                                            <ListGroup variant='flush'>
                                                {order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <Image src={item.image} alt={item.name} fluid rounded />
                                                            </Col>

                                                            <Col>
                                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                            </Col>

                                                            <Col md={4}>
                                                                {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                </ListGroup.Item>

                            </ListGroup>

                        </Col>

                        <Col md={4}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Order Summary</h2>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items:</Col>
                                            <Col>${order.itemsPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Shipping:</Col>
                                            <Col>${order.shippingPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Tax:</Col>
                                            <Col>${order.taxPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>${order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>
                                        <Row>
                                        <Col>
                                            <Button onClick={handleShow} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', border: 'none', background: 'none' }}>
                                                <Image src="images/bankily.png" style={{ width: '100px', height: '40px' }} />
                                            </Button>
                                        </Col>

                                        <Col>
                                            <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', border: 'none', background: 'none' }}>
                                                <Image src="images/bimbank.jfif" style={{ width: '100px', height: '40px' }} />
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', border: 'none', background: 'none' }}>
                                                <Image src="images/masrivy.png" style={{ width: '100px', height: '40px' }} />
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', border: 'none', background: 'none' }}>
                                                <Image src="images/seddad.png" style={{ width: '100px', height: '40px' }} />
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', border: 'none', background: 'none' }}>
                                                <Image src="images/bci.png" style={{ width: '100px', height: '40px' }} />
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', border: 'none', background: 'none' }}>
                                                <Image src="images/amanty.webp" style={{ width: '100px', height: '40px' }} />
                                            </Button>
                                        </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {!order.isPaid && (
                                        <ListGroup.Item>
                                            {loadingPay && <Loader />}

                                            {!sdkReady ? (
                                                <Loader />
                                            ) : (
                                                    <PayPalButton
                                                        amount={order.totalPrice}
                                                        onSuccess={successPaymentHandler}
                                                    />
                                                )}
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                                {/* debut */}
                                <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Connexion</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="formNumTel">
                                            <Form.Label>Numéro de Téléphone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Entrez votre numéro de téléphone"
                                                value={numTel}
                                                onChange={(e) => setNumTel(e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="formMotDePasse">
                                            <Form.Label>Mot de Passe</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Entrez votre mot de passe"
                                                value={motDePasse}
                                                onChange={(e) => setMotDePasse(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Annuler
                                    </Button>
                                    <Button variant="primary" onClick={handleConfirm}>
                                        Confirmer
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                                {/* fin */}
                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
}

export default OrderScreen
