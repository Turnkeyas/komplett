import { IOfferTemplateModel } from "./../offer-template/offer-template.model";

export const percentageToAmount = (
  num: number,
  percent: number | any
): number => {
  return (num * percent) / 100;
};

export const round = (num: any, decimalPlaces = 0): number => {
  var p = Math.pow(10, decimalPlaces);
  return Math.round(num * p) / p;
};

const getBrutPrice = (price: number, companySetting: any): number => {
  const percentageLabel = ["socialExpenses", "employersTax", "operatingCosts"];
  let cost = 0;
  percentageLabel.forEach((field) => {
    cost += (companySetting[field] * price) / 100;
  });

  return cost + price;
};
const calculateMaterial = (
  material: any,
  quantity: number,
  surcharge: IOfferTemplateModel
): number => {
  const price: number = material.itemPrice;
  const wastePercentage: number = material.quantity.svinn || 0;
  const totalToCount =
    material.quantity.quantityPerComponent +
    (material.quantity.quantityPerComponent * wastePercentage) / 100;
  // ((Totalt * mengde) + påslag) * pris
  const extra: number = surcharge.surchargeMaterials;

  const totalWithQuantity = totalToCount * quantity;
  const totalWithQuantityAndExtra =
    totalWithQuantity + (totalWithQuantity * extra) / 100;

  return totalWithQuantityAndExtra * price;
};

const calculateLabor = (
  material: any,
  surcharge: IOfferTemplateModel,
  companySetting: any,
  quantity: number
): number => {
  const minPerComponent: number = material.time.minPerComponent;
  const minuteRate: number = material.subjectDoc.hourlyRate / 60;
  const extra: number = surcharge.surchargeWorks;
  const minuteBrutPrice: number = getBrutPrice(minuteRate, companySetting);
  const totalMinAndQuantity = minPerComponent * quantity;
  const totalMinAndQuantityAndExtra =
    totalMinAndQuantity + percentageToAmount(totalMinAndQuantity, extra);

  return totalMinAndQuantityAndExtra * minuteBrutPrice;
};

export const getTotal = (
  material: any,
  quantity: number,
  surcharge: IOfferTemplateModel,
  companySetting: any
): number => {
  // console.log("-------");
  // if(!material.quantity.quantityPerComponent || !material.quantity.svinn) {
  //   console.log("material: ", material.application);
  // }
  // console.log("material: ", material.application);
  // console.log("quantity: ", material.quantity);
  // console.log(
  //   "labor:",
  //   calculateLabor(material, surcharge, companySetting, quantity)
  // );
  // console.log("material:", calculateMaterial(material, quantity, surcharge));
  return (
    calculateLabor(material, surcharge, companySetting, quantity) +
    calculateMaterial(material, quantity, surcharge)
  );
};
