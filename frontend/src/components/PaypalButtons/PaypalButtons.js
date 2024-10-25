import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import React, { useEffect } from 'react'
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PaypalButtons({order}) {
  return <PayPalScriptProvider
  options={{
    clientId: 'AVTZe_OGEFcnfg4pQUfiz1puPNU6BKmozM9DZYRqKYvpbOlcfgefEq4PxdGs5WwDIo61KHaag2GbTlg-'
  }}>

  <Buttons order={order} />
  </PayPalScriptProvider>
}


function Buttons({order}) {
    const {clearCart} = useCart();
    const navigate = useNavigate();
    const [{isPending}] = usePayPalScriptReducer();
    const {showLoading, hideLoading} = useLoading();
    useEffect(() => {
        isPending? showLoading() : hideLoading();
    });

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: order.totalPrice,
                    },
                },
            ],
        });
    }


    const onApprove = async (data, actions) => {
        try {
            const payment = await actions.order.capture();
            const orderId = await pay(payment.id);
            clearCart();
            toast.success('Betalning Sparades!', 'Success');
            navigate('/track/' + orderId);

        } catch (error) {
            toast.error('Fel Med Betalning', 'Error');
        }
    }

    const onError = () => {
        toast.error('Betalningen Misslyckades', 'Error');
    };

    return (
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
        />
    )
}