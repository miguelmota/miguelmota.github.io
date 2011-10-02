require 'rubygems'
require 'maruku'
require 'fileutils'

module Jekyll

  class Summary

    @@EMPTY = nil

    def self.empty
      if @@EMPTY.nil? then
        @@EMPTY = Summary.new("", "")
      end
      @@EMPTY
    end

    def initialize(source_file, html_file)
      @summary_file = source_file
      @summary_html = html_file
    end

    def to_liquid
      File.exists?(@summary_file) ? get_html : ""
    end

    def has_summary?
      File.exists?(@summary_file)
    end

    def inspect
      @summary_file
    end

    def to_s
      inspect
    end

    def get_html
      make = false
      if not File.exists?(@summary_html)
        puts("#{@summary_html} does not exist. Making it.")
        make = true
      elsif (File.mtime(@summary_html) <=> File.mtime(@summary_file)) < 0
        puts("#{@summary_html} is older than #{@summary_file}. Remaking it.")
        make = true
      end

      if make
        html = Maruku.new(File.readlines(@summary_file).join("")).to_html
        FileUtils.mkdir_p(File.dirname(@summary_html))
        f = File.open(@summary_html, 'w')
        f.write(html)
        f.close
      else
        html = File.readlines(@summary_html).join("")
      end

      html
    end
  end
end

