import { useState } from "react";
import useRequest from "../../hooks/useRequest";
import { useRouter } from "next/router";

function NewTicket() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    onSuccess: () => router.push("/"),
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    doRequest({ title, price });
  };

  return (
    <div>
      <h1> Create a Ticket </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewTicket;
