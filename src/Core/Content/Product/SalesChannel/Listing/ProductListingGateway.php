<?php declare(strict_types=1);

namespace Shopware\Core\Content\Product\SalesChannel\Listing;

use Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\Request;

/**
 * @deprecated tag:v6.2.0 use \Shopware\Core\Content\Product\SalesChannel\Listing\ProductListingRouteInterface instead
 */
class ProductListingGateway implements ProductListingGatewayInterface
{
    /**
     * @var ProductListingRouteInterface
     */
    private $productListingRoute;

    public function __construct(ProductListingRouteInterface $productListingRoute)
    {
        $this->productListingRoute = $productListingRoute;
    }

    public function search(Request $request, SalesChannelContext $salesChannelContext): EntitySearchResult
    {
        return $this->productListingRoute->load(
            $this->getNavigationId($request, $salesChannelContext),
            $request,
            $salesChannelContext
        )->getResult();
    }

    private function getNavigationId(Request $request, SalesChannelContext $salesChannelContext): string
    {
        if ($navigationId = $request->get('navigationId')) {
            return $navigationId;
        }

        $params = $request->attributes->get('_route_params');

        if ($params && isset($params['navigationId'])) {
            return $params['navigationId'];
        }

        return $salesChannelContext->getSalesChannel()->getNavigationCategoryId();
    }
}
