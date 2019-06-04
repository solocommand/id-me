import Route from '@ember/routing/route';
import query from '@base-cms/id-me-manage/gql/queries/organization/users-and-invitations';
import OrganizationContext from '@base-cms/id-me-manage/mixins/organization-context';

export default Route.extend(OrganizationContext, {

  model() {
    const org = this.modelFor('manage.organizations');
    return this.query(org.id, { query });
  },

});
