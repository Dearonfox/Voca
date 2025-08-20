import { useEffect, useState } from "react";

export default function useFetch<T>(url: string, initial: T): T {
  const [data, setData] = useState<T>(initial);
    useEffect(() => {
            fetch(url)
            .then(res=> {
                return res.json();
            })
            .then(data => {
                setData(data);
            });
        },[url]);
        return data;
}