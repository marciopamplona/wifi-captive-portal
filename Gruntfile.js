module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    var pkg = grunt.file.readJSON('package.json');

    // Project configuration
    grunt.initConfig({

        pkg: pkg,
        cssmin: {
            master: {
                files: {
                    'portal_src/wifi_portal.min.css': 'portal_src/wifi_portal.css'
                }
            }
        },
        uglify: {
            master: {
                options: {
                    preserveComments: false,
                    compress: {
                        drop_console: true,
                        global_defs: {
                            "DEBUG": false
                        }
                    },
                },
                files: {
                    'portal_src/wifi_portal.min.js': 'portal_src/wifi_portal.js'
                }
            }
        },
        copy: {
            source: {
                expand: true,
                cwd: 'portal_src/',
                src: ['wifi_portal.html', 'wifi_portal.js', 'wifi_portal.css'],
                dest: 'portal_src/',
                flatten: true
            },
            html: {
                src: ['portal_src/wifi_portal.html'],
                dest: 'portal_src/wifi_portal.html.tmp',
                options: {
                    process: function (content, srcpath) {
                        // Update CSS and JS files to gzip versions
                        return content.replace('wifi_portal.js', 'wifi_portal.min.js.gz').replace('wifi_portal.css', 'wifi_portal.min.css.gz');
                    },
                }
            }
        },
        clean: {
            source: ['portal_src/wifi_portal.html.tmp'],
            min: ['portal_src/wifi_portal.min.css', 'portal_src/wifi_portal.min.js', 'portal_src/wifi_portal.min.html']
        },
        htmlmin: {
            master: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'portal_src/wifi_portal.min.html': 'portal_src/wifi_portal.html.tmp'
                }
            }
        },
        compress: {
            gzip: {
                options: {
                    mode: 'gzip'
                },
                files: {
                    'fs/wifi_portal.min.html.gz': 'portal_src/wifi_portal.min.html',
                    'fs/wifi_portal.min.css.gz': 'portal_src/wifi_portal.min.css',
                    'fs/wifi_portal.min.js.gz': 'portal_src/wifi_portal.min.js',
                }
            }
        },
        replace: {
            ymlfs: {
                options: {
                    usePrefix: false,
                    patterns: [
                        {
                            match: 'portal_src',
                            replacement: 'fs'
                        },
                        {
                            match: '"portal.wifi.gzip", "b", false',
                            replace: '"portal.wifi.gzip", "b", true'
                        },
                        {
                            match: '"portal.wifi.reboot", "i", 0',
                            replace: '"portal.wifi.reboot", "i", 15'
                        }
                    ]
                },
                src: 'mos.yml',
                dest: 'mos.yml'
            }
        }
    });

    // Build for master branch
    grunt.registerTask('master', ['copy:html', 'htmlmin:master', 'cssmin:master', 'uglify:master', 'compress:gzip', 'clean:min', 'clean:source', 'replace:ymlfs' ]);
    grunt.registerTask('master-noclean', [ 'copy:html', 'htmlmin:master', 'cssmin:master', 'uglify:master', 'compress:gzip']);

    //grunt.util.linefeed = '\n';
};
