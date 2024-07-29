import { useRouter } from "next/router";
import useRequest from "../../hooks/useRequest";

function TicketShow({ ticket }) {
  const { title, price, id } = ticket;
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    onSuccess: (order) =>
      router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{title}</h1>
      <h4>price: {price}</h4>
      {errors}
      <button
        onClick={() => doRequest({ ticketId: id })}
        className="btn btn-primary"
      >
        Purchase
      </button>
    </div>
  );
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
