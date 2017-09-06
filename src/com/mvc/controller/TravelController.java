package com.mvc.controller;

import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.mvc.entiy.Travel;
import com.mvc.entiy.TravelTrade;
import com.mvc.service.TravelService;
import com.utils.StringUtil;

import net.sf.json.JSONObject;
/**
 * @ClassName: TravelController
 * @Description: TODO
 * @author ycj
 * @date 2017年8月14日 下午2:52:39 
 */
@Controller
@RequestMapping("/travelInfo")
public class TravelController {
	@Autowired
	TravelService travelService;
	/**
	 * 
	 * 
	 *@Title: selectTravel 
	 *@Description: 旅游查询
	 *@param @param request
	 *@param @param session
	 *@param @return
	 *@return String
	 *@throws
	 */
	@RequestMapping(value = "/selectTravelInfo.do")   //select Travel 
	public @ResponseBody String selectTravelAll(HttpServletRequest request, HttpSession session) {
		JSONObject jsonObject = new JSONObject();
		List<Travel> list = travelService.findTravelAlls();
		jsonObject.put("list", list);
		return jsonObject.toString();
	}
	
	@RequestMapping("/selectTravelInfoById.do")
	public @ResponseBody String selectTravelInfoById(HttpServletRequest request, HttpSession session) {
		String Travel_id = request.getParameter("travel_id_select");
		JSONObject jsonObject = new JSONObject();
		Travel list = travelService.findTravelById(Travel_id);
		jsonObject.put("list", list);
		return jsonObject.toString();
	}

	/** 
	 *@Title: addTravelTrade 
	 *@Description: 旅游交易 traveltrade
	 *@param @param request
	 *@param @param session
	 *@param @return
	 *@param @throws ParseException
	 *@return String
	 *@throws
	 */
	@RequestMapping(value = "/travelTrade.do")
	public @ResponseBody String addTravelTrade(HttpServletRequest request, HttpSession session) throws ParseException {
		JSONObject jsonObject = JSONObject.fromObject(request.getParameter("travelTrade"));
		TravelTrade travelTrade = new TravelTrade();
		if (jsonObject.containsKey("trtr_tel")) {
			if(StringUtil.strIsNotEmpty(jsonObject.getString("trtr_tel"))){
				travelTrade.setTrtr_tel(jsonObject.getString("trtr_tel"));
			}	
		}
		if (jsonObject.containsKey("trtr_price")) {
			if(StringUtil.strIsNotEmpty(jsonObject.getString("trtr_price"))){
				travelTrade.setTrtr_price(Float.parseFloat(jsonObject.getString("trtr_price")));
			}		
		}
		if (jsonObject.containsKey("trtr_mnum")) {
			if(StringUtil.strIsNotEmpty(jsonObject.getString("trtr_mnum"))){
				travelTrade.setTrtr_mnum(Integer.valueOf(jsonObject.getString("trtr_mnum")));
			}
		}
		if (jsonObject.containsKey("trtr_cnum")) {
			if(StringUtil.strIsNotEmpty(jsonObject.getString("trtr_cnum"))){
				travelTrade.setTrtr_cnum(Integer.valueOf(jsonObject.getString("trtr_cnum")));
			}
		}
		Travel travel = new Travel();
		if (jsonObject.containsKey("travel")) {
			if (StringUtil.strIsNotEmpty(jsonObject.getString("travel"))) {
				travel.setTravel_id(Integer.parseInt(jsonObject.getJSONObject("travel").getString("travel_id")));
				travelTrade.setTravel_id(travel);
			}
		}
		List<TravelTrade> result;
		if (jsonObject.containsKey("trtr_id")) {
			travelTrade.setTrtr_id(Integer.valueOf(jsonObject.getString("trtr_id")));
			result = travelService.saveTravelTrade(travelTrade);// 修改交易信息
		} else {
			result = travelService.saveTravelTrade(travelTrade);// 添加交易信息
		}
		return JSON.toJSONString(result);
	}
}
