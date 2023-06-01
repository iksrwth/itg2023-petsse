
		$(document).ready(function() {
			var selectionSnrList = document.querySelectorAll('[id^=selection_SNR]');
			for (let i = 0; i < selectionSnrList.length; i++) {
				let selection = selectionSnrList[i];
				$(selection).on('change', function() {
					changeSNR($(this));
				});
			}
			var selectionNoiseList = document.querySelectorAll('[id^=selection_Noise]');
			for (let i = 0; i < selectionNoiseList.length; i++) {
				let selection = selectionNoiseList[i];
				$(selection).on('change', function() {
					changeNoise($(this));
				});
			}
			var selectionSpeechList = document.querySelectorAll('[id^=selection_Speech]');
			for (let i = 0; i < selectionSpeechList.length; i++) {
				let selection = selectionSpeechList[i];
				$(selection).on('change', function() {
					changeSpeech($(this));
				});
			}
		});


		function changeSNR(selection) {
			selectionId = selection.attr('id');
			selectedSnr = selection.val();

			var audioList = document.querySelectorAll('[id^=' + selectionId.replace(/selection_SNR/, 'player_') + ']');
			var sourceList = document.querySelectorAll('[id^=' + selectionId.replace(/selection_SNR/, 'src_') + ']');

			for (let i = 0; i < audioList.length; i++) {
				let audio = audioList[i];
				let source = sourceList[i];

				audio.pause();

				if (selectedSnr) {
					source.src = source.src.replace(/_-?\d+dB_SNR/, "_" + selectedSnr + "dB_SNR");
					audio.load();

					var fileName = source.src.replace(/^.*[\\\/]/, '');
					fileName = decodeURI(fileName.replace('.wav', ''));
					var scoresPath = source.src.substring(0, source.src.lastIndexOf("/")+1);
					getScores(scoresPath+'scores.csv', fileName);
				}
			}
		}

		function changeNoise(selection) {
			selectionId = selection.attr('id');
			selectedNoise = selection.val();

			var audioList = document.querySelectorAll('[id^=' + selectionId.replace(/selection_Noise/, 'player_') + ']');
			var sourceList = document.querySelectorAll('[id^=' + selectionId.replace(/selection_Noise/, 'src_') + ']');

			for (let i = 0; i < audioList.length; i++) {
				let audio = audioList[i];
				let source = sourceList[i];

				audio.pause();

				if (selectedNoise) {
					source.src = source.src.replace(/(p\d+)_(\d+)_(.*)_(-?\d+dB_SNR)/, "$1_$2_" + selectedNoise + "_$4");
					audio.load();

					var fileName = source.src.replace(/^.*[\\\/]/, '');
					fileName = decodeURI(fileName.replace('.wav', ''));
					var scoresPath = source.src.substring(0, source.src.lastIndexOf("/")+1);
					getScores(scoresPath+'scores.csv', fileName);
				}
			}
		}

		function changeSpeech(selection) {
			selectionId = selection.attr('id');
			selectedSpeech = selection.val();

			var audioList = document.querySelectorAll('[id^=' + selectionId.replace(/selection_Speech/, 'player_') + ']');
			var sourceList = document.querySelectorAll('[id^=' + selectionId.replace(/selection_Speech/, 'src_') + ']');

			for (let i = 0; i < audioList.length; i++) {
				let audio = audioList[i];
				let source = sourceList[i];

				audio.pause();

				if (selectedSpeech) {
					source.src = source.src.replace(/(p\d+)_(\d+)_(.*)_(-?\d+dB_SNR)/, selectedSpeech + "_$3_$4");
					audio.load();

					var fileName = source.src.replace(/^.*[\\\/]/, '');
					fileName = decodeURI(fileName.replace('.wav', ''));
					var scoresPath = source.src.substring(0, source.src.lastIndexOf("/")+1);
					getScores(scoresPath+'scores.csv', fileName);
				}
			}
		}


		function getScores(scoresPath, fileName) {
			 var scoresTable = document.getElementById("scoresTable");
			 var selectedMeasures = ['PESQ', 'STOI', 'SegSNR', 'DNSMOS_OVRL', 'DNSMOS_SIG', 'DNSMOS_BAK'];
			 var folderName = scoresPath.substring(0, scoresPath.lastIndexOf("/"));
			 folderName = folderName.substring(folderName.lastIndexOf("/")+1, folderName.length);
			 var client = new XMLHttpRequest();
			 client.open('GET', scoresPath);
			 client.onreadystatechange = function() {
				var data = client.responseText;
				var lines = data.split("\n");
				for (var i = 0; i < lines.length; i++)
				{
				  var line = lines[i];
				  {
					 if (line.startsWith(fileName))
					 {
						var scores = line.split(',');
						for (var measureIdx = 0; measureIdx < selectedMeasures.length; measureIdx++)
						{
						  var columnIdx = -1;
						  var curMeasure = selectedMeasures[measureIdx];
						  headerNames = lines[0].split(',');
						  for (var j = 0; j < headerNames.length; j++)
						  {
							 if (headerNames[j].endsWith(curMeasure))
							 {
								columnIdx = j;
								break;
							 }
						  }

						  document.getElementById(curMeasure+'_'+folderName).innerHTML = Number(scores[columnIdx]).toFixed(3);
						}
 						break;
					 }
				  }
				}
			 }
			 client.send();
		}
