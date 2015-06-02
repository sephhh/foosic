# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


board1 = Board.create

pad1 = Sample.create(name: "Boom Kick", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/Boom-Kick.wav", :board_id => 1)
pad2 = Sample.create(name: "Electric-Bass-High-Bb-Staccato", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/Electric-Bass-High-Bb-Staccato.wav", :board_id => 1)
pad3 = Sample.create(name: "Contact Mic", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/ContactMic_Samples-NORM_79_Surprise_Sample_Pack.wav", :board_id => 1)
pad4 = Sample.create(name: "Cymbal_Zildjian", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/Cymbal_Zildjian_Avedis_12_st_mallets_07_Cymbal_Essentials.wav", :board_id => 1)
pad5 = Sample.create(name: "SD_militaire_synth", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/SD_militaire_synth_Synthdrum_PAck.wav", :board_id => 1)
pad6 = Sample.create(name: "booga_hit_double", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/booga_hit_doubleb06_World_Sounds_Vol1.wav", :board_id => 1)
pad7 = Sample.create(name: "ghana_bell_high", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/ghana_bell_high_Bell_Essentials.wav", :board_id => 1)
pad8 = Sample.create(name: "glass2_Bell", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/glass2_Bell_Essentials.wav", :board_id => 1)
pad9 = Sample.create(name: "yipp23_Analog", url:"https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/yipp23_Analog_Attitude.wav", :board_id => 1)


pad10 = Sample.create(name: "Boom Sub Analog", url: "https://dl.dropboxusercontent.com/s/0mtn1dbly5ua8be/BD_8forboom-sub_Analog%20Attitude.wav?dl=0")

pad11 = Sample.create(name: "Bell Mimo Analog", url: "https://dl.dropboxusercontent.com/s/z0iabnu3sjzkmgu/bell%20mimo_Analog%20Attitude.wav?dl=0")

pad12 = Sample.create(name: "Bella Synthdrum", url: "https://dl.dropboxusercontent.com/s/g0zwwn98k0mogoc/bella_Synthdrum%20Pack.wav?dl=0")

pad13 = Sample.create(name: "Multi Clap", url: "https://dl.dropboxusercontent.com/s/f1ug3l6uzzka1i4/Clap_multi%20snap.wav?dl=0")

pad14 = Sample.create(name: "Cereal", url: "https://dl.dropboxusercontent.com/s/d3svfvhk9x09b4c/SD_cereal%20me.wav?dl=0")

pad15 = Sample.create(name: "Don't wanna", url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/I_don't_wanna_do_it.wav")
pad16 = Sample.create(name: "Let's do it", url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/Let's_do_it.wav")
pad17 = Sample.create(name: "Let's doo it", url: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/282817/Let's_doo_it.wav")
