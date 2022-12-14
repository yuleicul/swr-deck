import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { createResponse } from "../../utils";

// How to elaborate on this:
// 1. excalidraw: stacks with key
// 2. await
//    Q&A preparation: what is `await` exactly?
// 3. setTimeout
const cache = new Map();

const CONCURRENT_PROMISES = {};

const useSWR = (key, fetcher) => {
  const keyRef = useRef(key);
  const [data, setData] = useState();

  const revalidate = useCallback(async () => {
    let newData;
    if (!CONCURRENT_PROMISES[key]) {
      CONCURRENT_PROMISES[key] = fetcher(key);
      newData = await CONCURRENT_PROMISES[key];

      delete CONCURRENT_PROMISES[key];
    } else {
      newData = await CONCURRENT_PROMISES[key];
    }

    keyRef.current = key;
    cache.set(key, newData);

    setData(newData);
  }, [fetcher, key]);

  useEffect(() => {
    revalidate();
  }, [revalidate]);

  return {
    data: keyRef.current === key ? data : cache.get(key),
  };
};

const fetcher = (id) =>
  createResponse(
    fetch(`https://api.github.com/repos/${id}`).then((r) =>
      r.json()
    ),
    1000
  );

// const fetcher = (id) =>
//   fetch(`https://api.github.com/repos/${id}`).then((r) =>
//     r.json()
//   );
export default function TrendingProjects() {
  const [id, setId] = useState("facebook/react");
  const { data } = useSWR(id, fetcher);

  return (
    <div>
      <h1>Trending Projects</h1>

      <div>
        <button onClick={() => setId("facebook/react")}>
          React
        </button>{" "}
        <button onClick={() => setId("vercel/swr")}>
          SWR
        </button>{" "}
        <button onClick={() => setId("TanStack/query")}>
          TanStack Query
        </button>
      </div>

      {data ? (
        <>
          <h2>{data.full_name}</h2>
          <ul>
            <li>forks: {data.forks_count}</li>
            <li>stars: {data.stargazers_count}</li>
            <li>watchers: {data.watchers}</li>
          </ul>
          <p>updated at: </p>
        </>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
