module Jekyll

  class Spaceless < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
    end

    def render(context)
      output = remove_space(super)
      output
    end
    
    def remove_space(array)
      output = ''
      
      array.each {|value|
        if value.kind_of?(Array)
          output << remove_space(value)
        elsif value.respond_to?('gsub')
          output << value.gsub(/[\n\r\t ]+/, '')
        end
      }
      
      output
    end
    
  end

end

Liquid::Template.register_tag('spaceless', Jekyll::Spaceless)