package songbooks

import grails.util.GrailsWebUtil

import org.codehaus.groovy.grails.web.servlet.WrappedResponseHolder
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.servlet.DispatcherServlet
import org.springframework.web.servlet.i18n.FixedLocaleResolver
import org.springframework.web.servlet.support.RequestContextUtils

class RenderEnvironmentFix {

	static void doFixWithMetaclass(){
		grails.plugin.rendering.document.RenderEnvironment.metaClass.init {
			originalRequestAttributes = RequestContextHolder.getRequestAttributes()
			def renderRequest = new MockHttpServletRequest(applicationContext.getServletContext())
			renderRequest.contextPath = originalRequestAttributes?.contextPath
			renderRequestAttributes = GrailsWebUtil.bindMockWebRequest(
					applicationContext,
					renderRequest,
					new MockHttpServletResponse())

			if (originalRequestAttributes) {
				renderRequestAttributes.controllerName = originalRequestAttributes.controllerName
			}

			def renderLocale
			if (locale) {
				renderLocale = locale
			} else if (originalRequestAttributes) {
				renderLocale = RequestContextUtils.getLocale(originalRequestAttributes.request)
			}
			renderRequestAttributes.request.setAttribute(
					DispatcherServlet.LOCALE_RESOLVER_ATTRIBUTE,
					new FixedLocaleResolver(defaultLocale: renderLocale))
			renderRequestAttributes.setOut(out)

			WrappedResponseHolder.wrappedResponse = renderRequestAttributes.currentResponse
		}
	}
}