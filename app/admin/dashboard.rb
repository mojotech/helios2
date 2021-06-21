ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    columns do
      column do
        panel "Info" do
          para "Welcome to ActiveAdmin for Helios"
          para "Use the above tabs to navigate models and edit their parameters"
          para "Alter the displayed wifi and bathroom codes, rearrange and
          \ adjust widget screentime, or even delete a traffic cam from view"
        end
      end
    end
  end
end
