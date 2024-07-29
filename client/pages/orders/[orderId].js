import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

function OrderShow({ order, currentUser }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    onSuccess: () => router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) return <div>Order Expired</div>;

  return (
    <div>
      Time left to pay: {timeLeft}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id, orderId: order.id })}
        stripeKey="pk_test_51PhL7lEfSwYKiyyPlXhxxU5lDHf0IktQYEt16wPHFFP2DQO1F1VAXPD80TM0Gb6AsjIzA507ElnmlrheGxSwU77S00OfmESBRS"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
export default OrderShow;
