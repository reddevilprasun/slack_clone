import { 
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
  isAuthenticatedNextjs
} from "@convex-dev/auth/nextjs/server";

const isPublicPath = createRouteMatcher([
  "/auth"
])
 
export default convexAuthNextjsMiddleware((request) => {
  if(!isPublicPath(request) && !isAuthenticatedNextjs()){
    return nextjsMiddlewareRedirect(request ,"/auth")
  }
  if(isPublicPath(request) && isAuthenticatedNextjs()){
    return nextjsMiddlewareRedirect(request ,"/")
  }
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};