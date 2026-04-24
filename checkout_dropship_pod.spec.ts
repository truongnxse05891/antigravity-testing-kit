import { expect, test } from "@core/fixtures";
import { SFCheckout } from "@pages/storefront/checkout";
import { OrdersPage } from "@pages/dashboard/orders";
import { DashboardAPI } from "@pages/api/dashboard";
import { CheckoutAPI } from "@pages/api/checkout";
import type { Order, ShippingMethod, OrderSummary } from "@types";
import { ProductAPI } from "@pages/api/product";
import { CatalogAPI } from "@pages/api/dashboard/catalog";
import { compareWithTolerance } from "@core/utils/checkout";
import { AppsAPI } from "@pages/api/apps";
import { PlusbaseOrderAPI } from "@pages/api/plusbase/order";

const verifyTaxOnOrderSummary = (isTaxInclude: boolean, expTaxAmount: number, actTaxAmount: number | string) => {
  if (isTaxInclude) {
    expect(actTaxAmount).toEqual("Tax included");
  } else {
    expect(actTaxAmount).toBe(Number(expTaxAmount.toFixed(2)));
  }
};

test.describe("Shipping profile cho item POD trong store PlusBase - full flow with UI", () => {
  test(`@SB_PLB_PODPL_POPLC_4 Kiểm tra checkout product POD và Dropship, cùng lineship Standard Shipping, có tax included, tip, discount percentage`, async ({
    conf,
    page,
    dashboard,
    authRequest,
    request,
  }) => {
    test.setTimeout(conf.suiteConf.timeout);
    const domain = conf.suiteConf.domain;
    const shippingAddress = conf.suiteConf.shipping_address;
    const shippingMethod = conf.suiteConf.shipping_method;
    const tippingInfo = conf.suiteConf.tipping_info;

    const orderPage = new OrdersPage(dashboard, domain);
    const dashboardApi = new DashboardAPI(domain, authRequest);
    const productApi = new ProductAPI(domain, authRequest);
    const catalogApi = new CatalogAPI(domain, authRequest);
    const checkoutApi = new CheckoutAPI(domain, request);
    const plusbaseOrderAPI = new PlusbaseOrderAPI(domain, authRequest);
    const isTaxInclude = conf.caseConf.is_tax_include;
    const discountInfo = conf.caseConf.discount_info;
    const productInfo = conf.caseConf.product_info;

    let shippingMethodInfo: ShippingMethod;
    let orderSummaryInfo: OrderSummary;
    let orderInfo: Order;
    let taxExclude = 0;
    let expTaxAmount;
    //update tax setting (include or exclude)
    await dashboardApi.updateTaxSettingPbPlb({ isTaxInclude: isTaxInclude });
    const checkoutAPI = new CheckoutAPI(domain, authRequest, page);
    const checkout = new SFCheckout(checkoutAPI.page, domain);

    test.setTimeout(conf.suiteConf.timeout);
    const appsAPI = new AppsAPI(conf.suiteConf.domain, authRequest);
    if (conf.caseConf.is_add_ppc) {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, true);
    } else {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, false);
    }

    await test.step(`Mở storefront > Add product vào cart > Thực hiện checkout có: tip + discount`, async () => {
      //checkout order
      await checkoutAPI.addProductToCartThenCheckout(conf.caseConf.product_checkout);
      await checkoutAPI.updateCustomerInformation();
      await checkoutAPI.openCheckoutPageByToken();

      // check show tip checkout
      if (conf.caseConf.layout && conf.suiteConf.theme_version === "V2") {
        await checkout.page.locator(checkout.xpathShowTip).check();

        await checkout.page.waitForTimeout(2000);
        await checkout.addTip(tippingInfo);
      } else {
        await checkout.inputCustomTip(tippingInfo.tipping_amount);
      }
      await checkout.applyDiscountCode(discountInfo.code);
      if (conf.suiteConf.theme_version === "V2") {
        await checkout.selectShippingMethod(shippingMethod);
      }
      const checkoutToken = checkout.getCheckoutToken();

      //get shipping method info
      if (conf.suiteConf.theme_version === "V2") {
        await checkoutApi.getShippingInfoByShippingGroupName(
          shippingMethod,
          shippingAddress.country_code,
          checkoutToken,
        );
      } else {
        await checkoutApi.getShippingInfoByShippingGroupNameNE(shippingMethod, checkoutToken);
      }
      shippingMethodInfo = checkoutApi.shippingMethod;
      await checkout.completeOrderWithMethod();

      //handle post purchase auto upsell
      await checkout.footerLoc.scrollIntoViewIfNeeded();
      await checkout.page.waitForTimeout(3000);
      if (await checkout.btnClosePPCPopup.isVisible()) {
        await checkout.btnClosePPCPopup.click();
      }

      //get order summary info
      orderSummaryInfo = await checkout.getOrderSummaryInfo();

      //expect order values
      const expDiscountValue = await checkout.calculateDiscountByType(discountInfo, conf.caseConf.expect_subtotal);
      const expTipping = Number(tippingInfo.tipping_amount);
      expTaxAmount = await checkoutApi.calculateTaxByLineItem(productInfo);
      if (isTaxInclude === false) {
        taxExclude = expTaxAmount;
      }
      const expTotal =
        conf.caseConf.expect_subtotal +
        shippingMethodInfo.shipping_fee +
        Number(expTipping.toFixed(2)) +
        taxExclude -
        expDiscountValue;

      //verify order info
      expect(compareWithTolerance(orderSummaryInfo.totalPrice, Number(expTotal.toFixed(2)), 0.01)).toEqual(true);
      expect(orderSummaryInfo.subTotal).toEqual(conf.caseConf.expect_subtotal);
      expect(orderSummaryInfo.shippingValue).toEqual(shippingMethodInfo.shipping_fee.toFixed(2));
      expect(orderSummaryInfo.discountValue).toEqual("-" + expDiscountValue.toFixed(2));
      expect(orderSummaryInfo.tippingVal).toEqual(Number(expTipping.toFixed(2)));
      verifyTaxOnOrderSummary(isTaxInclude, expTaxAmount, orderSummaryInfo.taxes);
    });

    await test.step(`Vào dashboard > Order detail > Kiểm tra order summary`, async () => {
      //open order detail
      const orderId = await checkout.getOrderIdBySDK();
      await orderPage.goToOrderByOrderId(orderId);
      // wait until order's profit has been calculated
      await orderPage.waitForProfitCalculated();

      //get order detail info
      orderInfo = await orderPage.getOrderSummaryInOrderDetail(plusbaseOrderAPI);

      //verify order detail info
      expect(compareWithTolerance(orderInfo.total, orderSummaryInfo.totalPrice, 0.01)).toEqual(true);
      expect(orderInfo.paid_by_customer).toEqual(0);
      expect(orderInfo.subtotal).toEqual(orderSummaryInfo.subTotal);
      expect(orderInfo.shipping_fee).toEqual(Number(orderSummaryInfo.shippingValue));
      expect(orderInfo.discount.toFixed(2)).toEqual(orderSummaryInfo.discountValue);
      expect(orderInfo.tip).toEqual(orderSummaryInfo.tippingVal);
      expect(orderInfo.tax_amount).toEqual(expTaxAmount);
    });

    await test.step(`Kiểm tra profit order`, async () => {
      //get product cost
      let expProductCost = 0;
      let taxInclude = 0;
      for (const product of productInfo) {
        if (product.base_name) {
          const basecost = await catalogApi.getBasecostByTitle(product.base_name);
          expProductCost += basecost;
          continue;
        }
        if (product.handle) {
          const productId = await productApi.getProductIdByHandle(product.handle);
          const productCost = await productApi.getProductCostItemPlbase(productId, product.variant_id);
          expProductCost += productCost;
        }
      }

      //calculate profit and fees
      if (isTaxInclude === true) {
        taxInclude = orderInfo.tax_amount;
      }
      orderPage.calculateProfitPlusbase(
        orderSummaryInfo.totalPrice,
        orderSummaryInfo.subTotal,
        Math.abs(Number(orderSummaryInfo.discountValue)),
        orderInfo.base_cost,
        orderInfo.shipping_cost,
        Number(orderSummaryInfo.shippingValue),
        taxInclude,
        orderSummaryInfo.tippingVal,
      );

      //verify shipping cost
      if (conf.suiteConf.theme_version === "V2") {
        expect(orderInfo.shipping_cost).toEqual(Number(shippingMethodInfo.origin_shipping_fee.toFixed(2)));
      }
      //verify product cost
      expect(orderInfo.base_cost).toEqual(Number(expProductCost.toFixed(2)));

      //verify profit and fees
      expect(compareWithTolerance(orderInfo.revenue, orderPage.revenue, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.handling_fee, orderPage.handlingFee, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.profit, orderPage.profit, 0.01)).toBe(true);
    });
  });

  test(`@SB_PLB_PODPL_POPLC_5 Kiểm tra checkout product POD và Dropship, khác shipping group, có tax excluded, tip, discount Fixed amount`, async ({
    conf,
    page,
    dashboard,
    authRequest,
    request,
  }) => {
    test.setTimeout(conf.suiteConf.timeout);
    const domain = conf.suiteConf.domain;
    const shippingAddress = conf.suiteConf.shipping_address;
    const shippingMethod = conf.suiteConf.shipping_method;
    const tippingInfo = conf.suiteConf.tipping_info;
    const checkout = new SFCheckout(page, domain);
    const orderPage = new OrdersPage(dashboard, domain);
    const dashboardApi = new DashboardAPI(domain, authRequest);
    const productApi = new ProductAPI(domain, authRequest);
    const catalogApi = new CatalogAPI(domain, authRequest);
    const checkoutApi = new CheckoutAPI(domain, request);
    const plusbaseOrderAPI = new PlusbaseOrderAPI(domain, authRequest);
    const isTaxInclude = conf.caseConf.is_tax_include;
    const discountInfo = conf.caseConf.discount_info;
    const productInfo = conf.caseConf.product_info;

    let shippingMethodInfo: ShippingMethod;
    let orderSummaryInfo: OrderSummary;
    let orderInfo: Order;
    let taxExclude = 0;
    let expTaxAmount;
    //update tax setting (include or exclude)
    await dashboardApi.updateTaxSettingPbPlb({ isTaxInclude: isTaxInclude });
    const checkoutAPI = new CheckoutAPI(domain, authRequest, checkout.page);

    test.setTimeout(conf.suiteConf.timeout);
    const appsAPI = new AppsAPI(conf.suiteConf.domain, authRequest);
    if (conf.caseConf.is_add_ppc) {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, true);
    } else {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, false);
    }

    await test.step(`Mở storefront > Add product vào cart > Thực hiện checkout có: tip + discount`, async () => {
      //checkout order
      await checkoutAPI.addProductToCartThenCheckout(conf.caseConf.product_checkout);
      await checkoutAPI.updateCustomerInformation();
      await checkoutAPI.openCheckoutPageByToken();

      // check show tip checkout
      if (conf.caseConf.layout && conf.suiteConf.theme_version === "V2") {
        await checkout.page.locator(checkout.xpathShowTip).check();

        await checkout.page.waitForTimeout(2000);
        await checkout.addTip(tippingInfo);
      } else {
        await checkout.inputCustomTip(tippingInfo.tipping_amount);
      }
      await checkout.applyDiscountCode(discountInfo.code);
      if (conf.suiteConf.theme_version === "V2") {
        await checkout.selectShippingMethod(shippingMethod);
      }
      const checkoutToken = checkout.getCheckoutToken();

      //get shipping method info
      if (conf.suiteConf.theme_version === "V2") {
        await checkoutApi.getShippingInfoByShippingGroupName(
          shippingMethod,
          shippingAddress.country_code,
          checkoutToken,
        );
      } else {
        await checkoutApi.getShippingInfoByShippingGroupNameNE(shippingMethod, checkoutToken);
      }
      shippingMethodInfo = checkoutApi.shippingMethod;
      await checkout.completeOrderWithMethod();

      //handle post purchase auto upsell
      await checkout.footerLoc.scrollIntoViewIfNeeded();
      await checkout.page.waitForTimeout(3000);
      if (await checkout.btnClosePPCPopup.isVisible()) {
        await checkout.btnClosePPCPopup.click();
      }

      //get order summary info
      orderSummaryInfo = await checkout.getOrderSummaryInfo();

      //expect order values
      const expDiscountValue = await checkout.calculateDiscountByType(discountInfo, conf.caseConf.expect_subtotal);
      const expTipping = Number(tippingInfo.tipping_amount);
      expTaxAmount = await checkoutApi.calculateTaxByLineItem(productInfo);
      if (isTaxInclude === false) {
        taxExclude = expTaxAmount;
      }
      const expTotal =
        conf.caseConf.expect_subtotal +
        shippingMethodInfo.shipping_fee +
        Number(expTipping.toFixed(2)) +
        taxExclude -
        expDiscountValue;

      //verify order info
      expect(compareWithTolerance(orderSummaryInfo.totalPrice, Number(expTotal.toFixed(2)), 0.01)).toEqual(true);
      expect(orderSummaryInfo.subTotal).toEqual(conf.caseConf.expect_subtotal);
      expect(orderSummaryInfo.shippingValue).toEqual(shippingMethodInfo.shipping_fee.toFixed(2));
      expect(orderSummaryInfo.discountValue).toEqual("-" + expDiscountValue.toFixed(2));
      expect(orderSummaryInfo.tippingVal).toEqual(Number(expTipping.toFixed(2)));
      verifyTaxOnOrderSummary(isTaxInclude, expTaxAmount, orderSummaryInfo.taxes);
    });

    await test.step(`Vào dashboard > Order detail > Kiểm tra order summary`, async () => {
      //open order detail
      const orderId = await checkout.getOrderIdBySDK();
      await orderPage.goToOrderByOrderId(orderId);
      // wait until order's profit has been calculated
      await orderPage.waitForProfitCalculated();

      //get order detail info
      orderInfo = await orderPage.getOrderSummaryInOrderDetail(plusbaseOrderAPI);

      //verify order detail info
      expect(compareWithTolerance(orderInfo.total, orderSummaryInfo.totalPrice, 0.01)).toEqual(true);
      expect(orderInfo.paid_by_customer).toEqual(0);
      expect(orderInfo.subtotal).toEqual(orderSummaryInfo.subTotal);
      expect(orderInfo.shipping_fee).toEqual(Number(orderSummaryInfo.shippingValue));
      expect(orderInfo.discount.toFixed(2)).toEqual(orderSummaryInfo.discountValue);
      expect(orderInfo.tip).toEqual(orderSummaryInfo.tippingVal);
      expect(orderInfo.tax_amount).toEqual(expTaxAmount);
    });

    await test.step(`Kiểm tra profit order`, async () => {
      //get product cost
      let expProductCost = 0;
      let taxInclude = 0;
      for (const product of productInfo) {
        if (product.base_name) {
          const basecost = await catalogApi.getBasecostByTitle(product.base_name);
          expProductCost += basecost;
          continue;
        }
        if (product.handle) {
          const productId = await productApi.getProductIdByHandle(product.handle);
          const productCost = await productApi.getProductCostItemPlbase(productId, product.variant_id);
          expProductCost += productCost;
        }
      }

      //calculate profit and fees
      if (isTaxInclude === true) {
        taxInclude = orderInfo.tax_amount;
      }
      orderPage.calculateProfitPlusbase(
        orderSummaryInfo.totalPrice,
        orderSummaryInfo.subTotal,
        Math.abs(Number(orderSummaryInfo.discountValue)),
        orderInfo.base_cost,
        orderInfo.shipping_cost,
        Number(orderSummaryInfo.shippingValue),
        taxInclude,
        orderSummaryInfo.tippingVal,
      );

      //verify shipping cost
      if (conf.suiteConf.theme_version === "V2") {
        expect(orderInfo.shipping_cost).toEqual(Number(shippingMethodInfo.origin_shipping_fee.toFixed(2)));
      }

      //verify product cost
      expect(orderInfo.base_cost).toEqual(Number(expProductCost.toFixed(2)));

      //verify profit and fees
      expect(compareWithTolerance(orderInfo.revenue, orderPage.revenue, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.handling_fee, orderPage.handlingFee, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.profit, orderPage.profit, 0.01)).toBe(true);
    });
  });

  test(`@SB_PLB_PODPL_POPLC_6 Kiểm tra checkout product POD và Dropship có item combo, cùng shipping group Fast, có tax included, tip, discount Fixed amount`, async ({
    conf,
    page,
    dashboard,
    authRequest,
    request,
  }) => {
    test.setTimeout(conf.suiteConf.timeout);
    const domain = conf.suiteConf.domain;
    const shippingAddress = conf.suiteConf.shipping_address;
    const shippingMethod = conf.suiteConf.shipping_method;
    const tippingInfo = conf.suiteConf.tipping_info;
    const checkout = new SFCheckout(page, domain);
    const orderPage = new OrdersPage(dashboard, domain);
    const dashboardApi = new DashboardAPI(domain, authRequest);
    const productApi = new ProductAPI(domain, authRequest);
    const catalogApi = new CatalogAPI(domain, authRequest);
    const checkoutApi = new CheckoutAPI(domain, request);
    const plusbaseOrderAPI = new PlusbaseOrderAPI(domain, authRequest);
    const isTaxInclude = conf.caseConf.is_tax_include;
    const discountInfo = conf.caseConf.discount_info;
    const productInfo = conf.caseConf.product_info;

    let shippingMethodInfo: ShippingMethod;
    let orderSummaryInfo: OrderSummary;
    let orderInfo: Order;
    let taxExclude = 0;
    let expTaxAmount;
    //update tax setting (include or exclude)
    await dashboardApi.updateTaxSettingPbPlb({ isTaxInclude: isTaxInclude });
    const checkoutAPI = new CheckoutAPI(domain, authRequest, checkout.page);

    test.setTimeout(conf.suiteConf.timeout);
    const appsAPI = new AppsAPI(conf.suiteConf.domain, authRequest);
    if (conf.caseConf.is_add_ppc) {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, true);
    } else {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, false);
    }

    await test.step(`Mở storefront > Add product vào cart > Thực hiện checkout có: tip + discount`, async () => {
      //checkout order
      await checkoutAPI.addProductToCartThenCheckout(conf.caseConf.product_checkout);
      await checkoutAPI.updateCustomerInformation();
      await checkoutAPI.openCheckoutPageByToken();

      // check show tip checkout
      if (conf.caseConf.layout && conf.suiteConf.theme_version === "V2") {
        await checkout.page.locator(checkout.xpathShowTip).check();

        await checkout.page.waitForTimeout(2000);
        await checkout.addTip(tippingInfo);
      } else {
        await checkout.inputCustomTip(tippingInfo.tipping_amount);
      }
      await checkout.applyDiscountCode(discountInfo.code);
      if (conf.suiteConf.theme_version === "V2") {
        await checkout.selectShippingMethod(shippingMethod);
      }
      const checkoutToken = checkout.getCheckoutToken();

      //get shipping method info
      if (conf.suiteConf.theme_version === "V2") {
        await checkoutApi.getShippingInfoByShippingGroupName(
          shippingMethod,
          shippingAddress.country_code,
          checkoutToken,
        );
      } else {
        await checkoutApi.getShippingInfoByShippingGroupNameNE(shippingMethod, checkoutToken);
      }
      shippingMethodInfo = checkoutApi.shippingMethod;
      await checkout.completeOrderWithMethod();

      //handle post purchase auto upsell
      await checkout.footerLoc.scrollIntoViewIfNeeded();
      await checkout.page.waitForTimeout(3000);
      if (await checkout.btnClosePPCPopup.isVisible()) {
        await checkout.btnClosePPCPopup.click();
      }

      //get order summary info
      orderSummaryInfo = await checkout.getOrderSummaryInfo();

      //expect order values
      const expDiscountValue = await checkout.calculateDiscountByType(discountInfo, conf.caseConf.expect_subtotal);
      const expTipping = Number(tippingInfo.tipping_amount);
      expTaxAmount = await checkoutApi.calculateTaxByLineItem(productInfo);
      if (isTaxInclude === false) {
        taxExclude = expTaxAmount;
      }
      const expTotal =
        conf.caseConf.expect_subtotal +
        shippingMethodInfo.shipping_fee +
        Number(expTipping.toFixed(2)) +
        taxExclude -
        expDiscountValue;

      //verify order info
      expect(compareWithTolerance(orderSummaryInfo.totalPrice, Number(expTotal.toFixed(2)), 0.01)).toEqual(true);
      expect(orderSummaryInfo.subTotal).toEqual(conf.caseConf.expect_subtotal);
      expect(orderSummaryInfo.shippingValue).toEqual(shippingMethodInfo.shipping_fee.toFixed(2));
      expect(orderSummaryInfo.discountValue).toEqual("-" + expDiscountValue.toFixed(2));
      expect(orderSummaryInfo.tippingVal).toEqual(Number(expTipping.toFixed(2)));
      verifyTaxOnOrderSummary(isTaxInclude, expTaxAmount, orderSummaryInfo.taxes);
    });

    await test.step(`Vào dashboard > Order detail > Kiểm tra order summary`, async () => {
      //open order detail
      const orderId = await checkout.getOrderIdBySDK();
      await orderPage.goToOrderByOrderId(orderId);
      // wait until order's profit has been calculated
      await orderPage.waitForProfitCalculated();

      //get order detail info
      orderInfo = await orderPage.getOrderSummaryInOrderDetail(plusbaseOrderAPI);

      //verify order detail info
      expect(compareWithTolerance(orderInfo.total, orderSummaryInfo.totalPrice, 0.01)).toEqual(true);
      expect(orderInfo.paid_by_customer).toEqual(0);
      expect(orderInfo.subtotal).toEqual(orderSummaryInfo.subTotal);
      expect(orderInfo.shipping_fee).toEqual(Number(orderSummaryInfo.shippingValue));
      expect(orderInfo.discount.toFixed(2)).toEqual(orderSummaryInfo.discountValue);
      expect(orderInfo.tip).toEqual(orderSummaryInfo.tippingVal);
      expect(orderInfo.tax_amount).toEqual(expTaxAmount);
    });

    await test.step(`Kiểm tra profit order`, async () => {
      //get product cost
      let expProductCost = 0;
      let taxInclude = 0;
      for (const product of productInfo) {
        if (product.base_name) {
          const basecost = await catalogApi.getBasecostByTitle(product.base_name);
          expProductCost += basecost;
          continue;
        }
        if (product.handle) {
          const productId = await productApi.getProductIdByHandle(product.handle);
          const productCost = await productApi.getProductCostItemPlbase(productId, product.variant_id);
          expProductCost += productCost;
        }
      }

      //calculate profit and fees
      if (isTaxInclude === true) {
        taxInclude = orderInfo.tax_amount;
      }
      orderPage.calculateProfitPlusbase(
        orderSummaryInfo.totalPrice,
        orderSummaryInfo.subTotal,
        Math.abs(Number(orderSummaryInfo.discountValue)),
        orderInfo.base_cost,
        orderInfo.shipping_cost,
        Number(orderSummaryInfo.shippingValue),
        taxInclude,
        orderSummaryInfo.tippingVal,
      );

      //verify shipping cost
      if (conf.suiteConf.theme_version === "V2") {
        expect(orderInfo.shipping_cost).toEqual(Number(shippingMethodInfo.origin_shipping_fee.toFixed(2)));
      }

      //verify product cost
      expect(orderInfo.base_cost).toEqual(Number(expProductCost.toFixed(2)));

      //verify profit and fees
      expect(compareWithTolerance(orderInfo.revenue, orderPage.revenue, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.handling_fee, orderPage.handlingFee, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.profit, orderPage.profit, 0.01)).toBe(true);
    });
  });

  test(`@SB_PLB_PODPL_POPLC_8 Kiểm tra checkout nhiều product POD, dropship, các product đều khác shipping group, có tax excluded, tip, discount Fixed amount`, async ({
    conf,
    page,
    dashboard,
    authRequest,
    request,
  }) => {
    test.setTimeout(conf.suiteConf.timeout);
    const domain = conf.suiteConf.domain;
    const shippingAddress = conf.suiteConf.shipping_address;
    const shippingMethod = conf.suiteConf.shipping_method;
    const tippingInfo = conf.suiteConf.tipping_info;
    const checkout = new SFCheckout(page, domain);
    const orderPage = new OrdersPage(dashboard, domain);
    const dashboardApi = new DashboardAPI(domain, authRequest);
    const productApi = new ProductAPI(domain, authRequest);
    const catalogApi = new CatalogAPI(domain, authRequest);
    const checkoutApi = new CheckoutAPI(domain, request);
    const plusbaseOrderAPI = new PlusbaseOrderAPI(domain, authRequest);
    const isTaxInclude = conf.caseConf.is_tax_include;
    const discountInfo = conf.caseConf.discount_info;
    const productInfo = conf.caseConf.product_info;

    let shippingMethodInfo: ShippingMethod;
    let orderSummaryInfo: OrderSummary;
    let orderInfo: Order;
    let taxExclude = 0;
    let expTaxAmount;
    //update tax setting (include or exclude)
    await dashboardApi.updateTaxSettingPbPlb({ isTaxInclude: isTaxInclude });
    const checkoutAPI = new CheckoutAPI(domain, authRequest, checkout.page);

    test.setTimeout(conf.suiteConf.timeout);
    const appsAPI = new AppsAPI(conf.suiteConf.domain, authRequest);
    if (conf.caseConf.is_add_ppc) {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, true);
    } else {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, false);
    }

    await test.step(`Mở storefront > Add product vào cart > Thực hiện checkout có: tip + discount`, async () => {
      //checkout order
      await checkoutAPI.addProductToCartThenCheckout(conf.caseConf.product_checkout);
      await checkoutAPI.updateCustomerInformation();
      await checkoutAPI.openCheckoutPageByToken();

      // check show tip checkout
      if (conf.caseConf.layout && conf.suiteConf.theme_version === "V2") {
        await checkout.page.locator(checkout.xpathShowTip).check();

        await checkout.page.waitForTimeout(2000);
        await checkout.addTip(tippingInfo);
      } else {
        await checkout.inputCustomTip(tippingInfo.tipping_amount);
      }
      await checkout.applyDiscountCode(discountInfo.code);
      if (conf.suiteConf.theme_version === "V2") {
        await checkout.selectShippingMethod(shippingMethod);
      }
      const checkoutToken = checkout.getCheckoutToken();

      //get shipping method info
      if (conf.suiteConf.theme_version === "V2") {
        await checkoutApi.getShippingInfoByShippingGroupName(
          shippingMethod,
          shippingAddress.country_code,
          checkoutToken,
        );
      } else {
        await checkoutApi.getShippingInfoByShippingGroupNameNE(shippingMethod, checkoutToken);
      }
      shippingMethodInfo = checkoutApi.shippingMethod;
      await checkout.completeOrderWithMethod();

      //handle post purchase auto upsell
      await checkout.footerLoc.scrollIntoViewIfNeeded();
      await checkout.page.waitForTimeout(3000);
      if (await checkout.btnClosePPCPopup.isVisible()) {
        await checkout.btnClosePPCPopup.click();
      }

      //get order summary info
      orderSummaryInfo = await checkout.getOrderSummaryInfo();

      //expect order values
      const expDiscountValue = await checkout.calculateDiscountByType(discountInfo, conf.caseConf.expect_subtotal);
      const expTipping = Number(tippingInfo.tipping_amount);
      expTaxAmount = await checkoutApi.calculateTaxByLineItem(productInfo);
      if (isTaxInclude === false) {
        taxExclude = expTaxAmount;
      }
      const expTotal =
        conf.caseConf.expect_subtotal +
        shippingMethodInfo.shipping_fee +
        Number(expTipping.toFixed(2)) +
        taxExclude -
        expDiscountValue;

      //verify order info
      expect(compareWithTolerance(orderSummaryInfo.totalPrice, Number(expTotal.toFixed(2)), 0.01)).toEqual(true);
      expect(orderSummaryInfo.subTotal).toEqual(conf.caseConf.expect_subtotal);
      expect(orderSummaryInfo.shippingValue).toEqual(shippingMethodInfo.shipping_fee.toFixed(2));
      expect(orderSummaryInfo.discountValue).toEqual("-" + expDiscountValue.toFixed(2));
      expect(orderSummaryInfo.tippingVal).toEqual(Number(expTipping.toFixed(2)));
      verifyTaxOnOrderSummary(isTaxInclude, expTaxAmount, orderSummaryInfo.taxes);
    });

    await test.step(`Vào dashboard > Order detail > Kiểm tra order summary`, async () => {
      //open order detail
      const orderId = await checkout.getOrderIdBySDK();
      await orderPage.goToOrderByOrderId(orderId);
      // wait until order's profit has been calculated
      await orderPage.waitForProfitCalculated();

      //get order detail info
      orderInfo = await orderPage.getOrderSummaryInOrderDetail(plusbaseOrderAPI);

      //verify order detail info
      expect(compareWithTolerance(orderInfo.total, orderSummaryInfo.totalPrice, 0.01)).toEqual(true);
      expect(orderInfo.paid_by_customer).toEqual(0);
      expect(orderInfo.subtotal).toEqual(orderSummaryInfo.subTotal);
      expect(orderInfo.shipping_fee).toEqual(Number(orderSummaryInfo.shippingValue));
      expect(orderInfo.discount.toFixed(2)).toEqual(orderSummaryInfo.discountValue);
      expect(orderInfo.tip).toEqual(orderSummaryInfo.tippingVal);
      expect(orderInfo.tax_amount).toEqual(expTaxAmount);
    });

    await test.step(`Kiểm tra profit order`, async () => {
      //get product cost
      let expProductCost = 0;
      let taxInclude = 0;
      for (const product of productInfo) {
        if (product.base_name) {
          const basecost = await catalogApi.getBasecostByTitle(product.base_name);
          expProductCost += basecost;
          continue;
        }
        if (product.handle) {
          const productId = await productApi.getProductIdByHandle(product.handle);
          const productCost = await productApi.getProductCostItemPlbase(productId, product.variant_id);
          expProductCost += productCost;
        }
      }

      //calculate profit and fees
      if (isTaxInclude === true) {
        taxInclude = orderInfo.tax_amount;
      }
      orderPage.calculateProfitPlusbase(
        orderSummaryInfo.totalPrice,
        orderSummaryInfo.subTotal,
        Math.abs(Number(orderSummaryInfo.discountValue)),
        orderInfo.base_cost,
        orderInfo.shipping_cost,
        Number(orderSummaryInfo.shippingValue),
        taxInclude,
        orderSummaryInfo.tippingVal,
      );

      //verify shipping cost
      if (conf.suiteConf.theme_version === "V2") {
        expect(orderInfo.shipping_cost).toEqual(Number(shippingMethodInfo.origin_shipping_fee.toFixed(2)));
      }

      //verify product cost
      expect(orderInfo.base_cost).toEqual(Number(expProductCost.toFixed(2)));

      //verify profit and fees
      expect(compareWithTolerance(orderInfo.revenue, orderPage.revenue, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.handling_fee, orderPage.handlingFee, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.profit, orderPage.profit, 0.01)).toBe(true);
    });
  });

  test(`@SB_PLB_PODPL_POPLC_10 Kiểm tra checkout product POD và Dropship, khác shipping group, có tax excluded, tip, discount Fixed amount, có markup shipping`, async ({
    conf,
    page,
    dashboard,
    authRequest,
    request,
  }) => {
    test.setTimeout(conf.suiteConf.timeout);
    const domain = conf.suiteConf.domain;
    const shippingAddress = conf.suiteConf.shipping_address;
    const shippingMethod = conf.suiteConf.shipping_method;
    const tippingInfo = conf.suiteConf.tipping_info;
    const checkout = new SFCheckout(page, domain);
    const orderPage = new OrdersPage(dashboard, domain);
    const dashboardApi = new DashboardAPI(domain, authRequest);
    const productApi = new ProductAPI(domain, authRequest);
    const catalogApi = new CatalogAPI(domain, authRequest);
    const checkoutApi = new CheckoutAPI(domain, request);
    const plusbaseOrderAPI = new PlusbaseOrderAPI(domain, authRequest);
    const isTaxInclude = conf.caseConf.is_tax_include;
    const discountInfo = conf.caseConf.discount_info;
    const productInfo = conf.caseConf.product_info;

    let shippingMethodInfo: ShippingMethod;
    let orderSummaryInfo: OrderSummary;
    let orderInfo: Order;
    let taxExclude = 0;
    let expTaxAmount;
    //update tax setting (include or exclude)
    await dashboardApi.updateTaxSettingPbPlb({ isTaxInclude: isTaxInclude });
    const checkoutAPI = new CheckoutAPI(domain, authRequest, checkout.page);

    test.setTimeout(conf.suiteConf.timeout);
    const appsAPI = new AppsAPI(conf.suiteConf.domain, authRequest);
    if (conf.caseConf.is_add_ppc) {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, true);
    } else {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, false);
    }

    await test.step(`Mở storefront > Add product vào cart > Thực hiện checkout có: tip + discount`, async () => {
      //checkout order
      await checkoutAPI.addProductToCartThenCheckout(conf.caseConf.product_checkout);
      await checkoutAPI.updateCustomerInformation();
      await checkoutAPI.openCheckoutPageByToken();

      // check show tip checkout
      if (conf.caseConf.layout && conf.suiteConf.theme_version === "V2") {
        await checkout.page.locator(checkout.xpathShowTip).check();

        await checkout.page.waitForTimeout(2000);
        await checkout.addTip(tippingInfo);
      } else {
        await checkout.inputCustomTip(tippingInfo.tipping_amount);
      }
      if (conf.suiteConf.theme_version === "V2") {
        await checkout.selectShippingMethod(shippingMethod);
      }

      await checkout.applyDiscountCode(discountInfo.code);
      const checkoutToken = checkout.getCheckoutToken();

      //get shipping method info
      if (conf.suiteConf.theme_version === "V2") {
        await checkoutApi.getShippingInfoByShippingGroupName(
          shippingMethod,
          shippingAddress.country_code,
          checkoutToken,
        );
      } else {
        await checkoutApi.getShippingInfoByShippingGroupNameNE(shippingMethod, checkoutToken);
      }

      shippingMethodInfo = checkoutApi.shippingMethod;
      await checkout.completeOrderWithMethod();

      //handle post purchase auto upsell
      await checkout.footerLoc.scrollIntoViewIfNeeded();
      await checkout.page.waitForTimeout(3000);
      if (await checkout.btnClosePPCPopup.isVisible()) {
        await checkout.btnClosePPCPopup.click();
      }

      //get order summary info
      orderSummaryInfo = await checkout.getOrderSummaryInfo();

      //expect order values
      const expDiscountValue = await checkout.calculateDiscountByType(discountInfo);
      const expTipping = Number(tippingInfo.tipping_amount);
      expTaxAmount = await checkoutApi.calculateTaxByLineItem(productInfo);
      if (isTaxInclude === false) {
        taxExclude = expTaxAmount;
      }
      const expTotal =
        conf.caseConf.expect_subtotal +
        shippingMethodInfo.shipping_fee +
        Number(expTipping.toFixed(2)) +
        taxExclude -
        expDiscountValue;

      //verify order info
      expect(compareWithTolerance(orderSummaryInfo.totalPrice, Number(expTotal.toFixed(2)), 0.01)).toEqual(true);
      expect(orderSummaryInfo.subTotal).toEqual(conf.caseConf.expect_subtotal);
      expect(orderSummaryInfo.shippingValue).toEqual(shippingMethodInfo.shipping_fee.toFixed(2));
      expect(orderSummaryInfo.discountValue).toEqual("-" + expDiscountValue.toFixed(2));
      expect(orderSummaryInfo.tippingVal).toEqual(Number(expTipping.toFixed(2)));
      verifyTaxOnOrderSummary(isTaxInclude, expTaxAmount, orderSummaryInfo.taxes);
    });

    await test.step(`Vào dashboard > Order detail > Kiểm tra order summary`, async () => {
      //open order detail
      const orderId = await checkout.getOrderIdBySDK();
      await orderPage.goToOrderByOrderId(orderId);
      // wait until order's profit has been calculated
      await orderPage.waitForProfitCalculated();

      //get order detail info
      orderInfo = await orderPage.getOrderSummaryInOrderDetail(plusbaseOrderAPI);

      //verify order detail info
      expect(compareWithTolerance(orderInfo.total, orderSummaryInfo.totalPrice, 0.01)).toEqual(true);
      expect(orderInfo.paid_by_customer).toEqual(0);
      expect(orderInfo.subtotal).toEqual(orderSummaryInfo.subTotal);
      expect(orderInfo.shipping_fee).toEqual(Number(orderSummaryInfo.shippingValue));
      expect(orderInfo.discount.toFixed(2)).toEqual(orderSummaryInfo.discountValue);
      expect(orderInfo.tip).toEqual(orderSummaryInfo.tippingVal);
      expect(orderInfo.tax_amount).toEqual(expTaxAmount);
    });

    await test.step(`Kiểm tra profit order`, async () => {
      //get product cost
      let expProductCost = 0;
      let taxInclude = 0;
      for (const product of productInfo) {
        if (product.base_name) {
          const basecost = await catalogApi.getBasecostByTitle(product.base_name);
          expProductCost += basecost;
          continue;
        }
        if (product.handle) {
          const productId = await productApi.getProductIdByHandle(product.handle);
          const productCost = await productApi.getProductCostItemPlbase(productId, product.variant_id);
          expProductCost += productCost;
        }
      }

      //calculate profit and fees
      if (isTaxInclude === true) {
        taxInclude = orderInfo.tax_amount;
      }
      orderPage.calculateProfitPlusbase(
        orderSummaryInfo.totalPrice,
        orderSummaryInfo.subTotal,
        Math.abs(Number(orderSummaryInfo.discountValue)),
        orderInfo.base_cost,
        orderInfo.shipping_cost,
        Number(orderSummaryInfo.shippingValue),
        taxInclude,
        orderSummaryInfo.tippingVal,
      );

      //verify shipping cost
      if (conf.suiteConf.theme_version === "V2") {
        expect(orderInfo.shipping_cost).toEqual(Number(shippingMethodInfo.origin_shipping_fee.toFixed(2)));
      }

      //verify product cost
      expect(orderInfo.base_cost).toEqual(Number(expProductCost.toFixed(2)));

      //verify profit and fees
      expect(compareWithTolerance(orderInfo.revenue, orderPage.revenue, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.handling_fee, orderPage.handlingFee, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.profit, orderPage.profit, 0.01)).toBe(true);
    });
  });

  test(`@SB_PLB_PODPL_POPLC_11 Kiểm tra checkout product POD và Dropship có combo, có markup shipping, có tax included, có discount Fixed amount, có add ppc POD`, async ({
    page,
    conf,
    dashboard,
    request,
    authRequest,
  }) => {
    test.setTimeout(conf.suiteConf.timeout);
    const domain = conf.suiteConf.domain;
    const tippingInfo = conf.suiteConf.tipping_info;
    const isTaxInclude = conf.caseConf.is_tax_include;
    const discountInfo = conf.caseConf.discount_info;
    const productInfo = conf.caseConf.product_info;
    const paymentMethod = conf.caseConf.payment_method;
    const productPPC = conf.caseConf.product_ppc_info;

    const checkout = new SFCheckout(page, domain);
    const orderPage = new OrdersPage(dashboard, domain);
    const dashboardApi = new DashboardAPI(domain, authRequest);
    const productApi = new ProductAPI(domain, authRequest);
    const catalogApi = new CatalogAPI(domain, authRequest);
    const plusbaseOrderAPI = new PlusbaseOrderAPI(domain, authRequest);

    let orderSummaryInfo: OrderSummary;
    let orderInfo: Order;
    let taxExclude = 0;
    let expTaxAmount, expTotal, expDiscountValue, checkoutToken;
    //update tax setting (include or exclude)
    await dashboardApi.updateTaxSettingPbPlb({ isTaxInclude: isTaxInclude });
    const checkoutAPI = new CheckoutAPI(domain, authRequest, checkout.page);

    const appsAPI = new AppsAPI(conf.suiteConf.domain, authRequest);
    if (productPPC.is_add_ppc) {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, true);
    } else {
      await appsAPI.actionEnableDisableApp(conf.suiteConf.app_name, false);
    }
    await test.step(`Mở storefront > Add product vào cart > Thực hiện checkout có: tip + discount`, async () => {
      //checkout order
      await checkoutAPI.addProductToCartThenCheckout(conf.caseConf.product_checkout);
      await checkoutAPI.updateCustomerInformation();
      await checkoutAPI.openCheckoutPageByToken();
      if (conf.caseConf.layout && conf.suiteConf.theme_version === "V2") {
        await checkout.page.locator(checkout.xpathShowTip).check();
        await checkout.addTip(tippingInfo);
      } else {
        await checkout.inputCustomTip(tippingInfo.tipping_amount);
      }
      await checkout.applyDiscountCode(discountInfo.code);

      await checkout.selectPaymentMethod(paymentMethod);
      checkoutToken = checkout.getCheckoutToken();
      await checkout.completeOrderViaPayPal();

      await expect(checkout.thankyouPageLoc).toBeVisible();
    });

    await test.step(`Add product PPC to cart > Kiểm tra order summary`, async () => {
      const checkoutApi = new CheckoutAPI(domain, request, page, checkoutToken);
      //add product ppc to cart
      await checkout.footerLoc.scrollIntoViewIfNeeded();
      await checkout.addProductPostPurchase(productPPC.name);
      await checkout.completePaymentForPostPurchaseItem(paymentMethod);
      await expect(checkout.thankyouPageLoc).toBeVisible();
      let shippingFee = 0;
      await expect(async () => {
        shippingFee = Number(await checkout.getShippingFeeOnOrderSummary());
        expect(shippingFee).toBeGreaterThan(0);
      }).toPass();

      //expect order values
      expDiscountValue = await checkout.calculateDiscountByType(discountInfo, conf.caseConf.expect_subtotal);
      const expTipping = Number(tippingInfo.tipping_amount);
      expTaxAmount = await checkoutApi.calculateTaxByLineItem(productInfo);
      expTaxAmount = await checkoutApi.calTaxItemPPC(productPPC);
      if (isTaxInclude === false) {
        taxExclude = expTaxAmount;
      }

      //get order summary info after add post purchase
      orderSummaryInfo = await checkout.getOrderSummaryInfo();

      //expect order value after add ppc
      expTotal =
        conf.caseConf.expect_subtotal +
        Number(checkout.itemPostPurchaseValue) +
        shippingFee +
        Number(expTipping.toFixed(2)) +
        taxExclude -
        expDiscountValue;

      //verify order info
      expect(orderSummaryInfo.totalPrice).toEqual(Number(expTotal.toFixed(2)));
      expect(orderSummaryInfo.subTotal).toEqual(conf.caseConf.expect_subtotal + Number(checkout.itemPostPurchaseValue));
      expect(orderSummaryInfo.discountValue).toEqual("-" + expDiscountValue.toFixed(2));
      expect(orderSummaryInfo.tippingVal).toEqual(Number(expTipping.toFixed(2)));
      verifyTaxOnOrderSummary(isTaxInclude, expTaxAmount, orderSummaryInfo.taxes);
    });

    await test.step(`Vào dashboard > Order detail > Kiểm tra order summary`, async () => {
      //open order detail
      const orderId = await checkout.getOrderIdBySDK();
      await orderPage.goToOrderByOrderId(orderId);

      // wait until order's profit has been calculated
      await orderPage.waitForProfitCalculated();

      //get order detail info
      orderInfo = await orderPage.getOrderSummaryInOrderDetail(plusbaseOrderAPI);

      //verify order detail info
      expect(orderInfo.total).toEqual(orderSummaryInfo.totalPrice);
      expect(orderInfo.paid_by_customer).toEqual(0);
      expect(orderInfo.subtotal).toEqual(orderSummaryInfo.subTotal);
      expect(orderInfo.discount.toFixed(2)).toEqual(orderSummaryInfo.discountValue);
      expect(orderInfo.tip).toEqual(orderSummaryInfo.tippingVal);
      expect(orderInfo.tax_amount).toEqual(expTaxAmount);
    });

    await test.step(`Kiểm tra profit order`, async () => {
      //get product cost
      let expProductCost = 0;
      let taxInclude = 0;
      for (const product of productInfo) {
        if (product.base_name) {
          const basecost = await catalogApi.getBasecostByTitle(product.base_name);
          expProductCost += basecost;
          continue;
        }
        if (product.handle) {
          const productId = await productApi.getProductIdByHandle(product.handle);
          const productCost = await productApi.getProductCostItemPlbase(productId, product.variant_id);
          expProductCost += productCost;
        }
      }
      if (productPPC.base_name) {
        const basecost = await catalogApi.getBasecostByTitle(productPPC.base_name);
        expProductCost += basecost;
      }

      //calculate profit and fees
      if (isTaxInclude === true) {
        taxInclude = orderInfo.tax_amount;
      }
      orderPage.calculateProfitPlusbase(
        orderSummaryInfo.totalPrice,
        orderSummaryInfo.subTotal,
        Math.abs(Number(orderSummaryInfo.discountValue)),
        orderInfo.base_cost,
        orderInfo.shipping_cost,
        Number(orderSummaryInfo.shippingValue),
        taxInclude,
        orderSummaryInfo.tippingVal,
      );

      //verify product cost
      expect(orderInfo.base_cost).toEqual(Number(expProductCost.toFixed(2)));

      //verify profit and fees
      expect(compareWithTolerance(orderInfo.revenue, orderPage.revenue, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.handling_fee, orderPage.handlingFee, 0.01)).toBe(true);
      expect(compareWithTolerance(orderInfo.profit, orderPage.profit, 0.01)).toBe(true);
    });
  });
});
