import Breadcrumbs from './breadcrumbComponent.vue'
import isEqual from 'lodash.isequal';

export default {
  version: '0.1.1',
  install (Vue, options) {
    function $_vue2Crumbs_dispatchNewValue(meta) {
      const {label, parentsList, parent, utils} = this.$breadcrumb

      if (!meta.breadcrumb) {
        meta.breadcrumb = {}
      }

      let metaBreadcrumb = meta.breadcrumb

      if (typeof metaBreadcrumb === 'string') {
        metaBreadcrumb = {
          label: metaBreadcrumb
        }
      }

      if (label) {
        metaBreadcrumb.label = label
      }

      if (parent) {
        metaBreadcrumb.parent = parent
      }

      if (parentsList) {
        metaBreadcrumb.parentsList = parentsList
      }
      if (utils) {
        metaBreadcrumb.utils = utils
      }

      this.$_vue2Crumbs_eventBUS.$emit('breadcrumbChanged')
    }

    function $_vue2Crumbs_checkMatchedRoutes() {
      if (this.$breadcrumb) {
        let matchedRoutes = [...this.$route.matched].reverse()
        for(let route of matchedRoutes) {
          const routeComponentInstance = route.instances.default

          if (isEqual(routeComponentInstance, this)) {
            $_vue2Crumbs_dispatchNewValue.call(this, route.meta)
            break
          }
        }
      }
    }

    Vue.prototype.$_vue2Crumbs_eventBUS = new Vue()

    Vue.component(Breadcrumbs.name, Breadcrumbs)

    Vue.mixin({
      methods: {
      },
      beforeCreate () {
        if (typeof this.$options.breadcrumb === 'function') {
          if (typeof this.$options.computed === 'undefined') {
            this.$options.computed = {}
          }
          this.$options.computed.$breadcrumb = this.$options.breadcrumb
        }
      },
      watch: {
        $route () {
          $_vue2Crumbs_checkMatchedRoutes.call(this)
        },
        $breadcrumb: {
          handler () {
            $_vue2Crumbs_checkMatchedRoutes.call(this)
          },
          immediate: true
        }
      }
    })
  }
}
