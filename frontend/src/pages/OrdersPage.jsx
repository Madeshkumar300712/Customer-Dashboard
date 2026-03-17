import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchOrders } from "../store/orderSlice";
import OrderTable from "../components/orders/OrderTable";

export default function OrdersPage() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchOrders()); }, []);
  return <div style={{ padding: 32 }}><OrderTable /></div>;
}