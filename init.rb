require 'hook_listener'

Redmine::Plugin.register :redmine_calc do
  name 'Redmine Calc plugin'
  author 'Boris Brodski'
  description 'With this plugin you can calulate totals of a sequence of numbers (supporting different formatting, like currency)'
  version '0.0.1'
  url 'http://example.com/path/to/plugin'
  author_url 'http://example.com/about'

  settings :default => {'prefix' => '{c:', 'postfix' => '}'}, :partial => 'settings/calc_settings'
end
