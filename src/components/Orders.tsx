import db from "../firebase/firebaseconfig";

import { isArray, isEqual, isObject, transform } from "lodash";

// import isArray from "lodash/isArray"

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { inspect } from "util";

export default function Orders({ order }: { order: OrderDetails }) {
  function difference(origObj: OrderDetails, newObj: OrderDetails) {
    function changes(newObj: any, origObj: any) {
      let arrayIndexCounter = 0;
      return transform(newObj, function (result: any, value, key) {
        if (!isEqual(value, origObj[key])) {
          let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
          result[resultKey] = isObject(value) && isObject(origObj[key]) ? changes(value, origObj[key]) : value;
        }
      });
    }
    return changes(newObj, origObj);
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "orders", order.orderId), (doc) => {
      const data = doc.data() as OrderDetails;

      //   console.log("here");

      const diff = difference(order, data);
      //   console.log("here 2");

      //   console.log(diff);

      if (Object.keys(diff).length !== 0) {
        console.log(inspect(diff, { showHidden: true, depth: null, colors: true }));
        console.log(diff);

        // if (diff.hasOwnProperty("orderItemDetails")) {
        if (diff.orderItemDetails.ingredients.selected) {
          console.log("changed to", diff.orderItemDetails.ingredients.selected);
        }
      }
    });

    return () => unsubscribe();
  }, [order]);

  return <div>{order.orderId}</div>;
}
