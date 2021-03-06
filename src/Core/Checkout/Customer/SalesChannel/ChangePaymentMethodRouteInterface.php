<?php declare(strict_types=1);

namespace Shopware\Core\Checkout\Customer\SalesChannel;

use Shopware\Core\Framework\Validation\DataBag\RequestDataBag;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Core\System\SalesChannel\SuccessResponse;

/**
 * This route is used to change the default payment method of a logged-in user
 */
interface ChangePaymentMethodRouteInterface
{
    public function change(string $paymentMethodId, RequestDataBag $requestDataBag, SalesChannelContext $context): SuccessResponse;
}
