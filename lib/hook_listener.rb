class HookListener < Redmine::Hook::ViewListener
  include ActionView::Helpers::JavaScriptHelper

  def view_layouts_base_html_head(context={} )
    [
      "",
      "<!-- RedmineCalc plugin -->",
      javascript_include_tag('redmine-calc', :plugin => 'redmine_calc'),
      javascript_include_tag('numbro-min', :plugin => 'redmine_calc'),
      javascript_include_tag('languages-min', :plugin => 'redmine_calc'),
      stylesheet_link_tag('redmine-calc', :plugin => 'redmine_calc'),
      "",
      '<script type="text/javascript">',
      "  $.RedmineCalc = {",
      "    prefix: '#{escape_javascript Setting.plugin_redmine_calc['prefix']}',",
      "    postfix: '#{escape_javascript Setting.plugin_redmine_calc['postfix']}',",
      "    lastId: 0",
      "  };",
      "</script>",
      "",
      ""
    ].join("\n")
  end
end
