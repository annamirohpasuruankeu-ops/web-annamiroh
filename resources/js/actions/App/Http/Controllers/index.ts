import PublicPackageController from './PublicPackageController'
import HomeController from './HomeController'
import DashboardController from './DashboardController'
import RoleDashboardController from './RoleDashboardController'
import AdminUserController from './AdminUserController'
import ManifestFinalizationController from './ManifestFinalizationController'
import AdminController from './AdminController'
import FinanceController from './FinanceController'
import InvoiceController from './InvoiceController'
import RecommendationController from './RecommendationController'
import Settings from './Settings'
const Controllers = {
    PublicPackageController: Object.assign(PublicPackageController, PublicPackageController),
HomeController: Object.assign(HomeController, HomeController),
DashboardController: Object.assign(DashboardController, DashboardController),
RoleDashboardController: Object.assign(RoleDashboardController, RoleDashboardController),
AdminUserController: Object.assign(AdminUserController, AdminUserController),
ManifestFinalizationController: Object.assign(ManifestFinalizationController, ManifestFinalizationController),
AdminController: Object.assign(AdminController, AdminController),
FinanceController: Object.assign(FinanceController, FinanceController),
InvoiceController: Object.assign(InvoiceController, InvoiceController),
RecommendationController: Object.assign(RecommendationController, RecommendationController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers