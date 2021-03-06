/* global cy */
import elements from '../sw-general.page-object';

export default class OrderPageObject {
    constructor() {
        this.elements = {
            ...elements,
            ...{
                userMetadata: '.sw-order-user-card__metadata'
            }
        };
    }

    setOrderState({ stateTitle, type, signal = 'neutral', scope = 'select', call = null }, isMailTemplateAssigned) {
        const stateColor = `.sw-order-state__${signal}-select`;
        const callType = type === 'payment' ? '_transaction' : '';

        // Request we want to wait for later
        cy.server();
        cy.route({
            url: `/api/v1/_action/order${callType}/**/state/${call}`,
            method: 'post'
        }).as(`${call}Call`);


        cy.get(`.sw-order-state-${scope}__${type}-state select[name=sw-field--selectedActionName]`).scrollIntoView();
        cy.get(`.sw-order-state-${scope}__${type}-state select[name=sw-field--selectedActionName]`)
            .should('be.visible')
            .select(stateTitle);

        cy.get('.sw-order-state-change-modal')
            .should('be.visible');

        if (!isMailTemplateAssigned) {
            cy.get('.sw-order-state-change-modal-assign-mail-template__entity-listing .sw-data-grid__row--0 input')
                .click();

            cy.get('.sw-order-state-change-modal-assign-mail-template__button')
                .click();
        }

        cy.get('.sw-order-state-change-modal-attach-documents__button')
            .click();

        cy.wait(`@${call}Call`).then((xhr) => {
            expect(xhr).to.have.property('status', 200);

            cy.get(`.sw-order-state-${scope}__${type}-state .sw-loader__element`).should('not.exist');
            cy.get(this.elements.loader).should('not.exist');
            cy.get(this.elements.smartBarHeader).click();

            if (scope === 'select') {
                cy.get(stateColor).should('be.visible');
            }
        });
    }

    checkOrderHistoryEntry({ type, stateTitle, signal = 'neutral', position = 0 }) {
        const currentStatusIcon = `.sw-order-state__${signal}-icon`;
        const item = `.sw-order-state-history-card__${type}-state .sw-order-state-history__entry--${position}`;

        cy.get('.sw-order-state-card').scrollIntoView();
        cy.get('.sw-order-state-card').should('be.visible');
        cy.get(`${item} ${currentStatusIcon}`).should('be.visible');
        cy.get(item).contains(stateTitle);
    }
}
